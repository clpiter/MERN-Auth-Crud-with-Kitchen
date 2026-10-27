const sessionService = require("../services/session");

async function getSessions(req,res){
    try{
        const sessions = await sessionService.listSessions(req.user.id,req.sessionId);
        res.json({sessions});
    } catch(error){
        console.log(error.message);
        res.status(500).json({message:"Server error"});
    }
}

async function revokeSession(req,res){
    try{
        const revoked = await sessionService.revokeSession(req.user.id,req.params.id);
        if(!revoked){
            return res.status(404).json({message:"Session not found"});
        }
        res.json({message:"Session revoked",current:req.params.id === String(req.sessionId)});
    } catch(error){
        console.log(error.message);
        res.status(500).json({message:"Server error"});
    }
}

async function revokeOtherSessions(req,res){
    try{
        const count = await sessionService.revokeOtherSessions(req.user.id,req.sessionId);
        res.json({message:`Logged out of ${count} other session(s)`,count});
    } catch(error){
        console.log(error.message);
        res.status(500).json({message:"Server error"});
    }
}

module.exports={getSessions,revokeSession,revokeOtherSessions};
