const mongoose = require("mongoose");
const Item = require("../models/item");

const ITEM_FIELDS = ["name","category","description","unit","price","quantity","image"];

function pickFields(data){
    const picked = {};
    ITEM_FIELDS.forEach((field)=>{
        if(data[field] !== undefined){
            picked[field] = data[field];
        }
    });
    return picked;
}

function placeholderImage(name){
    return `https://placehold.co/480x360?text=${encodeURIComponent(name || "Item")}`;
}

function escapeRegex(text){
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getItems(query){
    // Query values can arrive as arrays/objects (?search=a&search=b), so force strings
    const search = typeof query.search === "string" ? query.search.trim() : "";
    const category = typeof query.category === "string" ? query.category : "";
    const { page = 1, limit = 12 } = query;
    const filter = {};
    if(search){
        const pattern = new RegExp(escapeRegex(search),"i");
        filter.$or = [{name:pattern},{description:pattern}];
    }
    if(category){
        filter.category = category;
    }

    const safeLimit = Math.min(Math.max(parseInt(limit) || 12,1),100);
    const safePage = Math.max(parseInt(page) || 1,1);

    const [items,total,categories] = await Promise.all([
        Item.find(filter).sort({category:1,name:1}).skip((safePage-1)*safeLimit).limit(safeLimit),
        Item.countDocuments(filter),
        Item.distinct("category")
    ]);

    return {
        items,
        total,
        page:safePage,
        pages:Math.max(Math.ceil(total/safeLimit),1),
        categories:categories.sort()
    };
}

async function getItemById(id){
    if(!mongoose.isValidObjectId(id)){
        return null;
    }
    return Item.findById(id);
}

async function createItem(data,userId){
    const itemData = pickFields(data);
    if(!itemData.image){
        itemData.image = placeholderImage(itemData.name);
    }
    const item = new Item({...itemData,createdBy:userId});
    return item.save();
}

async function updateItem(id,data){
    if(!mongoose.isValidObjectId(id)){
        return null;
    }
    const itemData = pickFields(data);
    if(itemData.image === ""){
        const existing = await Item.findById(id);
        if(!existing){
            return null;
        }
        itemData.image = placeholderImage(itemData.name || existing.name);
    }
    return Item.findByIdAndUpdate(id,itemData,{new:true,runValidators:true});
}

async function deleteItem(id){
    if(!mongoose.isValidObjectId(id)){
        return null;
    }
    return Item.findByIdAndDelete(id);
}

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem };
