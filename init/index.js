const mongoose = require("mongoose");
const Listing = require("../modules/listing.js");
const initData = require("./data.js");

const initDB = async () => {
    await Listing.deleteMany({});

    const ownerId = new mongoose.Types.ObjectId("6870af21546c14a459610a60");

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: ownerId
    }));

    await Listing.insertMany(initData.data);
    console.log("total data inserted");
};

initDB();
