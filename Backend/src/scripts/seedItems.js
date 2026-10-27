const Item = require("../models/item");
const demoItems = require("../data/demoItems");

// Inserts the demo list when the collection is empty.
// Pass reset=true to wipe all items and restore the demo list.
async function seedItems(reset = false){
    try{
        if(reset){
            await Item.deleteMany({});
        } else if(await Item.estimatedDocumentCount() > 0){
            return;
        }
        await Item.insertMany(demoItems);
        console.log(`Seeded ${demoItems.length} demo items`);
    } catch(error){
        console.log(error.message);
    }
}

// `npm run seed` resets the demo list
if(require.main === module){
    require("dotenv").config();
    const mongoose = require("mongoose");
    const { connectDB } = require("../configuration/dbConfig");
    connectDB()
        .then(()=>seedItems(true))
        .finally(()=>mongoose.disconnect());
}

module.exports = seedItems;
