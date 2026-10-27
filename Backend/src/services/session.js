const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Session = require("../models/session");
const User = require("../models/user");
const { generateToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwtUtils");

// A session stays alive while it is used at least once every SESSION_TTL_DAYS
const SESSION_TTL_SECONDS = (Number(process.env.SESSION_TTL_DAYS) || 7) * 24 * 60 * 60;

function newJti(){
    return crypto.randomBytes(32).toString("base64url");
}

// Device info shown on the "Active sessions" page
function requestMeta(req){
    const forwarded = req.headers["x-forwarded-for"];
    const ip = (typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket?.remoteAddress) || "";
    return {
        ip:ip.trim(),
        userAgent:String(req.headers["user-agent"] || "").slice(0,300)
    };
}

// Gives the session a fresh refresh token: the previous one stops working
async function rotate(session){
    const jti = newJti();
    session.refreshTokenHash = await bcrypt.hash(jti,10);
    session.expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
    return generateRefreshToken(session._id, jti, SESSION_TTL_SECONDS);
}

// Verifies the refresh JWT and that it is the session's current one
async function findSessionByRefreshToken(refreshToken){
    if(typeof refreshToken !== "string") return null;
    let payload;
    try{
        payload = verifyRefreshToken(refreshToken);
    } catch{
        return null;
    }
    if(!mongoose.isValidObjectId(payload.sid) || typeof payload.jti !== "string") return null;

    const session = await Session.findById(payload.sid);
    if(!session || session.expiresAt <= new Date()) return null;
    const matches = await bcrypt.compare(payload.jti, session.refreshTokenHash);
    return matches ? session : null;
}

async function createSession(user, meta){
    const session = new Session({user:user._id, ...meta});
    const refreshToken = await rotate(session);
    await session.save();
    return {
        token:generateToken(user, session._id),
        refreshToken
    };
}

// Issues a new access token and rotates the refresh token
async function refreshSession(refreshToken, meta){
    const session = await findSessionByRefreshToken(refreshToken);
    if(!session) throw new Error("Invalid session");

    const user = await User.findById(session.user);
    if(!user){
        await session.deleteOne();
        throw new Error("Invalid session");
    }

    const newRefreshToken = await rotate(session);
    session.lastUsedAt = new Date();
    session.ip = meta.ip;
    session.userAgent = meta.userAgent;
    await session.save();

    return {
        token:generateToken(user, session._id),
        refreshToken:newRefreshToken
    };
}

// Used by the auth middleware on every request so revoked sessions stop working immediately
async function isSessionActive(sessionId, userId){
    if(!mongoose.isValidObjectId(sessionId)) return false;
    const session = await Session.findById(sessionId).select("user expiresAt").lean();
    return !!session && String(session.user) === String(userId) && session.expiresAt > new Date();
}

// Logout: works even when the access token has already expired
async function endSessionByRefreshToken(refreshToken){
    const session = await findSessionByRefreshToken(refreshToken);
    if(session){
        await session.deleteOne();
    }
}

async function listSessions(userId, currentSessionId){
    const sessions = await Session.find({user:userId}).sort({lastUsedAt:-1}).lean();
    const now = new Date();
    return sessions
        .filter((session)=>session.expiresAt > now)
        .map((session)=>({
            id:session._id,
            userAgent:session.userAgent,
            ip:session.ip,
            createdAt:session.createdAt,
            lastUsedAt:session.lastUsedAt,
            expiresAt:session.expiresAt,
            current:String(session._id) === String(currentSessionId)
        }));
}

async function revokeSession(userId, sessionId){
    if(!mongoose.isValidObjectId(sessionId)) return false;
    const result = await Session.deleteOne({_id:sessionId,user:userId});
    return result.deletedCount > 0;
}

async function revokeOtherSessions(userId, currentSessionId){
    const sessions = await Session.find({user:userId}).select("_id").lean();
    const otherIds = sessions.map((s)=>s._id).filter((id)=>String(id) !== String(currentSessionId));
    if(otherIds.length === 0) return 0;
    // sanitizeFilter is on globally, so $in has to be marked as trusted
    const result = await Session.deleteMany({_id:mongoose.trusted({$in:otherIds})});
    return result.deletedCount;
}

module.exports = {
    requestMeta,
    createSession,
    refreshSession,
    isSessionActive,
    endSessionByRefreshToken,
    listSessions,
    revokeSession,
    revokeOtherSessions
};
