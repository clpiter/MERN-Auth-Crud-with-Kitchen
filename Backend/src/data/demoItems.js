// 100 daily needs of a home kitchen: [name, unit, price, image]
// image is a TheMealDB ingredient name or a full image URL (Wikimedia Commons)
const catalog = {
    "Vegetables":[
        ["Tomatoes","1 kg",120,"Tomatoes"],
        ["Onions","1 kg",100,"Onions"],
        ["Potatoes","1 kg",80,"Potatoes"],
        ["Garlic","250 g",90,"Garlic"],
        ["Ginger","250 g",110,"Ginger"],
        ["Green Chillies","250 g",60,"Green Chilli"],
        ["Carrots","1 kg",100,"Carrots"],
        ["Spinach","1 bunch",50,"Spinach"],
        ["Cauliflower","1 piece",120,"https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Chou-fleur_02.jpg/330px-Chou-fleur_02.jpg"],
        ["Fresh Coriander","1 bunch",30,"Coriander"]
    ],
    "Fruits":[
        ["Bananas","1 dozen",150,"Banana"],
        ["Apples","1 kg",300,"Apples"],
        ["Lemons","250 g",80,"Lemons"],
        ["Oranges","1 dozen",280,"Orange"],
        ["Mangoes","1 kg",250,"Mango"],
        ["Grapes","500 g",220,"https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Grapes%2C_Rostov-on-Don%2C_Russia.jpg/330px-Grapes%2C_Rostov-on-Don%2C_Russia.jpg"],
        ["Watermelon","1 piece",350,"https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Taiwan_2009_Tainan_City_Organic_Farm_Watermelon_FRD_7962.jpg/330px-Taiwan_2009_Tainan_City_Organic_Farm_Watermelon_FRD_7962.jpg"],
        ["Pomegranate","1 kg",400,"Pomegranate"],
        ["Papaya","1 piece",180,"Papaya"],
        ["Guava","1 kg",160,"https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Guava_pink_fruit.jpg/330px-Guava_pink_fruit.jpg"]
    ],
    "Dairy & Eggs":[
        ["Fresh Milk","1 L",220,"Milk"],
        ["Eggs","1 dozen",360,"Eggs"],
        ["Plain Yogurt","1 kg",260,"Plain Yogurt"],
        ["Butter","200 g",450,"Butter"],
        ["Cheddar Cheese","200 g",600,"Cheddar Cheese"],
        ["Paneer","250 g",400,"Paneer"],
        ["Fresh Cream","200 ml",230,"Double Cream"],
        ["Condensed Milk","397 g",450,"Condensed Milk"],
        ["Milk Powder","400 g",900,"https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Milk_powder_cropped.jpg/330px-Milk_powder_cropped.jpg"],
        ["Mozzarella","200 g",650,"Mozzarella"]
    ],
    "Grains & Pulses":[
        ["Basmati Rice","5 kg",1800,"Basmati Rice"],
        ["Whole Wheat Flour (Atta)","10 kg",1500,"Plain Flour"],
        ["Red Lentils (Masoor Daal)","1 kg",320,"Red Lentils"],
        ["Chickpeas","1 kg",340,"Chickpeas"],
        ["Yellow Lentils (Moong Daal)","1 kg",360,"Yellow Split Peas"],
        ["Kidney Beans","1 kg",450,"Kidney Beans"],
        ["Rolled Oats","500 g",400,"Rolled Oats"],
        ["Semolina (Suji)","1 kg",200,"Semolina"],
        ["Vermicelli","400 g",150,"Vermicelli"],
        ["Pasta","500 g",300,"Penne Rigate"]
    ],
    "Spices & Condiments":[
        ["Salt","800 g",60,"Salt"],
        ["Red Chilli Powder","200 g",250,"Red Chilli Powder"],
        ["Turmeric Powder","200 g",220,"Turmeric Powder"],
        ["Cumin Seeds","100 g",180,"Cumin Seeds"],
        ["Garam Masala","100 g",240,"Garam Masala"],
        ["Black Pepper","100 g",300,"Black Pepper"],
        ["Coriander Powder","200 g",200,"Ground Coriander"],
        ["Tomato Ketchup","800 g",450,"Tomato Ketchup"],
        ["Soy Sauce","300 ml",280,"Soy Sauce"],
        ["White Vinegar","500 ml",120,"White Vinegar"]
    ],
    "Oils & Ghee":[
        ["Cooking Oil","5 L",2900,"Vegetable Oil"],
        ["Desi Ghee","1 kg",2400,"Ghee"],
        ["Olive Oil","500 ml",1600,"Olive Oil"],
        ["Mustard Oil","1 L",650,"Mustard Seeds"],
        ["Sunflower Oil","1 L",620,"Sunflower Oil"],
        ["Canola Oil","1 L",600,"Canola Oil"],
        ["Banaspati Ghee","1 kg",560,"Vegetable Shortening"],
        ["Coconut Oil","500 ml",900,"Coconut Cream"],
        ["Sesame Oil","250 ml",700,"Sesame Seed Oil"],
        ["Corn Oil","1 L",640,"Sweetcorn"]
    ],
    "Bakery":[
        ["Sandwich Bread","1 loaf",180,"Bread"],
        ["Brown Bread","1 loaf",220,"Bread Rolls"],
        ["Burger Buns","6 pcs",200,"Bun"],
        ["Rusk","300 g",220,"Breadcrumbs"],
        ["Croissants","4 pcs",400,"Puff Pastry"],
        ["Pita Bread","5 pcs",200,"Pita Bread"],
        ["Tortilla Wraps","6 pcs",350,"Tortillas"],
        ["Cake Rusk","250 g",280,"https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Zwieback-1.jpg/330px-Zwieback-1.jpg"],
        ["Plain Cookies","300 g",250,"Digestive Biscuits"],
        ["Fruit Cake","400 g",600,"Raisins"]
    ],
    "Beverages":[
        ["Black Tea","900 g",1600,"Tea"],
        ["Green Tea","30 bags",350,"https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Green_tea_3_appearances.jpg/330px-Green_tea_3_appearances.jpg"],
        ["Instant Coffee","100 g",900,"Coffee"],
        ["Mineral Water","1.5 L",100,"Water"],
        ["Orange Juice","1 L",380,"Orange Juice"],
        ["Mango Juice","1 L",360,"https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Glass_of_Mango_Juice.jpg/500px-Glass_of_Mango_Juice.jpg"],
        ["Soft Drink","1.5 L",200,"Coca-Cola"],
        ["Hot Chocolate","200 g",750,"Hot Chocolate"],
        ["Lemon Squash","800 ml",450,"Lemon Juice"],
        ["Rose Syrup","800 ml",400,"Rose Water"]
    ],
    "Snacks & Sweeteners":[
        ["Sugar","1 kg",160,"Sugar"],
        ["Brown Sugar","500 g",200,"Brown Sugar"],
        ["Honey","500 g",900,"Honey"],
        ["Jaggery (Gur)","1 kg",300,"Muscovado Sugar"],
        ["Potato Chips","150 g",150,"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Potato-Chips.jpg/330px-Potato-Chips.jpg"],
        ["Salted Peanuts","200 g",250,"Peanuts"],
        ["Almonds","250 g",900,"Almonds"],
        ["Dates","500 g",600,"Medjool Dates"],
        ["Mixed Fruit Jam","440 g",380,"Raspberry Jam"],
        ["Peanut Butter","340 g",700,"Peanut Butter"]
    ],
    "Cleaning & Household":[
        ["Dishwashing Liquid","500 ml",280,"https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Afwasmiddel.jpg/330px-Afwasmiddel.jpg"],
        ["Dish Sponges","3 pcs",150,"https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/%C3%89ponge_type_3_%281%29.jpg/330px-%C3%89ponge_type_3_%281%29.jpg"],
        ["Kitchen Towels","2 rolls",300,"https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Paper_towel.jpg/330px-Paper_towel.jpg"],
        ["Aluminium Foil","1 roll",450,"https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Aluminio.jpg/330px-Aluminio.jpg"],
        ["Cling Film","1 roll",400,"https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Pvc-Film.jpg/330px-Pvc-Film.jpg"],
        ["Garbage Bags","30 pcs",250,"https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Black_garbage_bag.jpg/500px-Black_garbage_bag.jpg"],
        ["Surface Cleaner","500 ml",350,"https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Window_cleaner_and_an_empty_spray_bottle.jpg/500px-Window_cleaner_and_an_empty_spray_bottle.jpg"],
        ["Hand Wash","250 ml",220,"https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Blue_liquid_soap_in_a_plastic_dispenser_1.jpg/500px-Blue_liquid_soap_in_a_plastic_dispenser_1.jpg"],
        ["Matchboxes","10 pcs",60,"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Friction_d%27une_allumette.jpg/330px-Friction_d%27une_allumette.jpg"],
        ["Water Filter Cartridge","1 piece",1200,"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Haushalts-Wasserfilter.jpg/500px-Haushalts-Wasserfilter.jpg"]
    ]
};

const descriptions = {
    "Vegetables":(name)=>`Farm-fresh ${name.toLowerCase()} picked for everyday cooking. Store in a cool, dry place or the vegetable drawer.`,
    "Fruits":(name)=>`Fresh, seasonal ${name.toLowerCase()} for snacking, desserts and juices. Wash well before eating.`,
    "Dairy & Eggs":(name)=>`${name} for daily breakfast, baking and cooking. Keep refrigerated and use before the expiry date.`,
    "Grains & Pulses":(name)=>`${name}, a pantry staple for daily meals. Store in an airtight container away from moisture.`,
    "Spices & Condiments":(name)=>`${name} to season and flavour your everyday dishes. Keep tightly closed after opening.`,
    "Oils & Ghee":(name)=>`${name} for frying, sautéing and tempering. Store away from direct sunlight.`,
    "Bakery":(name)=>`Freshly baked ${name.toLowerCase()} for breakfast, tea time and lunch boxes. Best enjoyed within a few days.`,
    "Beverages":(name)=>`${name} for refreshing drinks at home. Serve hot or chilled as you like.`,
    "Snacks & Sweeteners":(name)=>`${name} for sweet treats, snacks and recipes. Keep sealed to stay fresh.`,
    "Cleaning & Household":(name)=>`${name} to keep your kitchen clean and organised every day.`
};

const demoItems = [];
Object.entries(catalog).forEach(([category,items])=>{
    items.forEach(([name,unit,price,imageName])=>{
        const index = demoItems.length + 1;
        demoItems.push({
            name,
            category,
            unit,
            price,
            quantity:(index * 7) % 40 + 5,
            description:descriptions[category](name),
            image:imageName.startsWith("http")
                ? imageName
                : `https://www.themealdb.com/images/ingredients/${encodeURIComponent(imageName)}.png`
        });
    });
});

module.exports = demoItems;
