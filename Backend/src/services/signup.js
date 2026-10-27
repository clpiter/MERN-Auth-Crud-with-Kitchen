const User = require("../models/user");
const bcrypt = require("bcryptjs");

async function createUser(userData){
    const{name, email, password}= userData;
    if(typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim()){
        throw new Error("Name and email are required");
    }
    if(typeof password !== "string" || password.length < 6){
        throw new Error("Password must be at least 6 characters");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({email:normalizedEmail});
    if(existingUser){
        throw new Error("Email is already registered");
    }
    const hashedPassword = await bcrypt.hash(password,10);

    const createdUser = new User({
        name:name.trim(),
        email:normalizedEmail,
        password:hashedPassword,
        role:"customer"
    })

    const savedUser = await createdUser.save();
    // Never send the password hash back to the client
    const { password: _password, ...safeUser } = savedUser.toObject();
    return safeUser;
}

module.exports= {createUser};
