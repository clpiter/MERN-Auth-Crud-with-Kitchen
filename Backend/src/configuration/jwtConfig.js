const crypto = require("crypto");

// On Vercel every function instance would get a different random key,
// so JWT_SECRET must be set in production.
if(!process.env.JWT_SECRET){
    console.warn("JWT_SECRET is not set, using a random key (tokens reset on restart)");
}

const secretKey = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");

module.exports= {
    secretKey:secretKey
}
