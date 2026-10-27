const User = require("../models/user");
const bcrypt = require("bcryptjs");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "chanderlalpiter0@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

async function createAdminAccount(){
    try{
        const existingAdmin = await User.findOne({email:ADMIN_EMAIL});
        if(!existingAdmin){
            const newAdmin = new User({
                email:ADMIN_EMAIL,
                name:"Admin",
                password:await bcrypt.hash(ADMIN_PASSWORD,10),
                role:"admin"
            })
            await newAdmin.save();
            console.log("Admin account created successfully");
        } else{
            console.log("Admin already exist");
        }
    } catch(error){
        console.log(error.message);
    }

}

module.exports = createAdminAccount;
