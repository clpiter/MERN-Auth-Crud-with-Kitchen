const mongoose= require("mongoose");

const itemSchema = new mongoose.Schema({
    name:{type:String,required:[true,"Name is required"],trim:true},
    category:{type:String,required:[true,"Category is required"],trim:true},
    description:{type:String,default:"",trim:true},
    unit:{type:String,default:"",trim:true},
    price:{type:Number,default:0,min:[0,"Price cannot be negative"]},
    quantity:{type:Number,default:0,min:[0,"Quantity cannot be negative"]},
    image:{type:String,default:"",trim:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
},{timestamps:true});

module.exports= mongoose.model("Item",itemSchema);
