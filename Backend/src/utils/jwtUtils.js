const jwt = require("jsonwebtoken");
const {secretKey } = require("../configuration/jwtConfig");

// Short-lived token sent with every API request
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";

function generateToken(user, sessionId){
    const payload = {
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        sid:sessionId,
        type:"access"
    }
    return jwt.sign(payload,secretKey,{expiresIn:ACCESS_TOKEN_TTL});
}

// Long-lived token only used to get a new access token for the session.
// jti is a random id; the session stores its bcrypt hash so a rotated token can't be reused.
function generateRefreshToken(sessionId, jti, expiresInSeconds){
    return jwt.sign({sid:sessionId,jti,type:"refresh"},secretKey,{expiresIn:expiresInSeconds});
}

function verifyRefreshToken(token){
    const payload = jwt.verify(token,secretKey);
    if(payload.type !== "refresh"){
        throw new Error("Not a refresh token");
    }
    return payload;
}

module.exports={
    generateToken,
    generateRefreshToken,
    verifyRefreshToken
};
