const mongoose = require("mongoose");

// One document per logged-in device. Deleting it logs that device out.
const sessionSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},
    // Only a hash of the refresh token is stored, never the token itself
    refreshTokenHash:{type:String,required:true},
    userAgent:{type:String,default:""},
    ip:{type:String,default:""},
    lastUsedAt:{type:Date,default:Date.now},
    expiresAt:{type:Date,required:true}
},{timestamps:true});

// MongoDB removes expired sessions automatically
sessionSchema.index({expiresAt:1},{expireAfterSeconds:0});

module.exports = mongoose.model("Session",sessionSchema);
