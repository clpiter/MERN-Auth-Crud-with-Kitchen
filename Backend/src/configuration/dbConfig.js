const mongoose = require('mongoose');

// Strip `$` operators from query filters to block NoSQL injection via request bodies
mongoose.set("sanitizeFilter", true);

const MONGODB_URI =process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jwt_db";

// Cache the connection so serverless invocations (Vercel) reuse it
let connectionPromise = null;

function connectDB(){
    if(!connectionPromise){
        connectionPromise = mongoose.connect(MONGODB_URI).catch((err)=>{
            connectionPromise = null;
            throw err;
        });
    }
    return connectionPromise;
}

mongoose.connection.on("connected",()=>{
    console.log("Connected to MongoDB");
});

mongoose.connection.on("error",(err)=>{
    console.log(`MongoDB connection error:${err}`)
})

module.exports = { connectDB };
