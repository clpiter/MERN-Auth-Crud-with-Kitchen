const authService = require("../services/login");
const sessionService = require("../services/session");

async function login(req,res){
    try{
        const{email,password}= req.body;
        const tokens = await authService.login(email,password,sessionService.requestMeta(req));
        res.json(tokens);
    } catch(error){
        res.status(401).json({message:"Invalid credentials"});
    }
}

async function refreshToken(req,res){
    try{
        const{refreshToken}= req.body;
        const tokens = await authService.refreshToken(refreshToken,sessionService.requestMeta(req));
        res.json(tokens);
    } catch(error){
        res.status(401).json({message:"Session expired, please log in again"});
    }
}

async function logout(req,res){
    try{
        await authService.logout(req.body.refreshToken);
    } catch(error){
        console.log(error.message);
    }
    // Always succeed: the client clears its tokens either way
    res.json({message:"Logged out"});
}

module.exports={
    login,
    refreshToken,
    logout
}
