const mongoose = require('mongoose')
const initData = require('./data.js');
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(() => {
    console.log("connection established");
}).catch((err) => {
    console.log(err);
});

const initDB = async () => {
    // Clear existing data
    await Listing.deleteMany({});
    
    // Create a test user
    let testUser;
    try {
        // Check if test user already exists
        testUser = await User.findOne({ username: "testuser" });
        
        if (!testUser) {
            // Create a new test user if not exists
            const newUser = new User({
                email: "test@example.com",
                username: "testuser"
            });
            testUser = await User.register(newUser, "password123");
            console.log("Test user created");
        }
        
        // Add sample listings with owner and geometry data
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: testUser._id,
            geometry: {
                type: "Point",
                coordinates: [
                    Math.random() * 360 - 180, // Random longitude between -180 and 180
                    Math.random() * 180 - 90   // Random latitude between -90 and 90
                ]
            }
        }));
        
        await Listing.insertMany(initData.data);
        console.log("Data Inserted");
    } catch (err) {
        console.log("Error during initialization:", err);
    }
};

initDB();