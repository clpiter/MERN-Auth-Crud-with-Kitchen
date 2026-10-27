const bcrypt= require ('bcryptjs');
const User = require('../models/user');
const sessionService = require("./session");

// Checks the credentials and opens a new session for this device
async function login(email,password,meta){
    try{
        if(typeof email !== "string" || typeof password !== "string"){
            throw new Error("Email and password are required");
        }
        const existingUser = await User.findOne({email:email.trim().toLowerCase()});
        if(!existingUser){
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password,existingUser.password);
        if(!isPasswordValid){
            throw new Error("Incorrect password");
        }
        return await sessionService.createSession(existingUser,meta);
    } catch(error){
        // console.log("Login error :",error.message);
        throw new Error("Invalid credentials")
    }
}

async function refreshToken(oldRefreshToken,meta){
   try{
    return await sessionService.refreshSession(oldRefreshToken,meta);
   }catch(error){
    throw new Error("Invalid token");
   }
}

async function logout(refreshToken){
    await sessionService.endSessionByRefreshToken(refreshToken);
}

module.exports= {login,refreshToken,logout}
