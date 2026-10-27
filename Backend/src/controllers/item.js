const itemService = require("../services/item");

function handleError(res,error){
    if(error.name === "ValidationError" || error.name === "CastError"){
        return res.status(400).json({message:error.message});
    }
    console.log(error);
    res.status(500).json({message:"Server error"});
}

async function getItems(req,res){
    try{
        const result = await itemService.getItems(req.query);
        res.json(result);
    } catch(error){
        handleError(res,error);
    }
}

async function getItem(req,res){
    try{
        const item = await itemService.getItemById(req.params.id);
        if(!item){
            return res.status(404).json({message:"Item not found"});
        }
        res.json(item);
    } catch(error){
        handleError(res,error);
    }
}

async function createItem(req,res){
    try{
        const item = await itemService.createItem(req.body,req.user.id);
        res.status(201).json({item:item,message:"Item created successfully"});
    } catch(error){
        handleError(res,error);
    }
}

async function updateItem(req,res){
    try{
        const item = await itemService.updateItem(req.params.id,req.body);
        if(!item){
            return res.status(404).json({message:"Item not found"});
        }
        res.json({item:item,message:"Item updated successfully"});
    } catch(error){
        handleError(res,error);
    }
}

async function deleteItem(req,res){
    try{
        const item = await itemService.deleteItem(req.params.id);
        if(!item){
            return res.status(404).json({message:"Item not found"});
        }
        res.json({message:"Item deleted successfully"});
    } catch(error){
        handleError(res,error);
    }
}

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
