const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // YOUR USER ID
            author: "5ffa7dac449fd21072a00f4b",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima voluptatum ex eveniet eum ipsam, dolorem non iure praesentium dolores repellendus sapiente maiores, accusamus tenetur, eligendi adipisci molestias vero suscipit soluta.",
            price, // Don't need to set price to price, this will call the price number and set it as the value
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude, 
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: "https://res.cloudinary.com/dnjkb3clh/image/upload/v1610313115/YelpCamp/op739it6ofxrwud0cyp4.png",
                    filename: "YelpCamp/op739it6ofxrwud0cyp4"
                }
            ]
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});