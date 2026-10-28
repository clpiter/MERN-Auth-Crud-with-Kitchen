require("dotenv").config();
const express = require('express');
const signupRoute = require("./src/routes/signup");
const loginRoute= require("./src/routes/login");
const itemRoute = require("./src/routes/item");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./src/configuration/dbConfig");
const createAdminAccount = require("./src/scripts/admin");
const seedItems = require("./src/scripts/seedItems");
const app = express();
const PORT = process.env.PORT || 5000;

// Deployed frontend, always allowed. Vercel gives every deployment its own URL
// (mern-auth-crud-with-kitchen-8zi5-<hash>-piter-computer-works.vercel.app), so match them all.
const frontendOrigins = [
    "https://mern-auth-crud-with-kitchen-8zi5-2xt66vdi7-piter-computer-works.vercel.app",
    /^https:\/\/mern-auth-crud-with-kitchen-8zi5(-[a-z0-9]+)*-piter-computer-works\.vercel\.app$/
];

// Comma separated list of extra allowed frontend URLs, e.g. http://localhost:5173.
// Leave CORS_ORIGIN empty to allow every origin.
const allowedOrigins = process.env.CORS_ORIGIN
    ? [...frontendOrigins, ...process.env.CORS_ORIGIN.split(",").map((origin)=>origin.trim().replace(/\/$/,""))]
    : true;

app.use(cors({origin:allowedOrigins}));
app.use(bodyParser.json());

// Connect and run one-time setup lazily so it also works on serverless cold starts
let initPromise = null;
function init(){
    if(!initPromise){
        initPromise = connectDB()
            .then(async ()=>{
                await createAdminAccount();
                await seedItems();
            })
            .catch((err)=>{
                initPromise = null;
                throw err;
            });
    }
    return initPromise;
}

app.use(async (req,res,next)=>{
    try{
        await init();
        next();
    } catch(error){
        console.log(error.message);
        res.status(500).json({message:"Database connection failed"});
    }
});

app.get("/",(req,res)=>{
    res.json({status:"ok"});
});

app.use("/user",signupRoute);
app.use("/auth",loginRoute);
app.use("/api",itemRoute);

if(require.main === module){
    app.listen(PORT, ()=>{
        console.log(`Server is running on: http://localhost:${PORT}`);
    })
}

module.exports = app;
