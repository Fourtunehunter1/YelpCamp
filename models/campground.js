const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema; // This is just a shortcut to make it easier to use, since we'll be referencing mongoose.Schema a lot!
// will shorten it from mongoose.Schema to just Schema

const ImageSchema = new Schema({
    url: String, 
    filename: String,
});

ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_200");
});
// Why are we using a virtual?
// Because we don't need to store this on our model or in the DB, because it's derived from the DB already
// We're gonna have to make a request to get the information anyway, since we're storing a url
// So no reason to store the original URL, change it and then also store the changed URL when we could just alter the URLs
// That way we don't have to increase how much we're storing and save us the coding
// Every time we call "thumbnail" it will run this virtual and every time there's an "/upload" it will replace it with what we set

const opts = { toJSON: { virtuals: true } }; // This allows Mongoose to pass us our virtuals as JSON
// Basically makes it so that if we parse any of our Mongoose data, our virtuals will come with it

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String, // Don't do { location: { type: String } }
            enum: ['Point'], //location.type must be 'Point', HAS TO BE A "Point"!!!!
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
        <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
        <p>${this.description.substring(0, 60)}...</p>`
});
// Remember: This will add a new array onto your campgrounds. Basically pushes a new array, that we're calling properties, onto the Schema object
// Alongside the other things already in there, like price and description
// It's also adding the key of popUpMarkup to that properties object and setting its value to whatever we return
// Just so you remember how virtuals work

// Middleware to delete all reviews linked to a campground
CampgroundSchema.post("findOneAndDelete", async function(doc) { 
    // Just as a note, the middleware we define in the first parameter, in this case findOneAndDelete, NEEDS to be specific to what you're doing
    // If you used a different method to delete and didn't change this to reflect that specific change this wouldn't work
    // Or would need to create a seperate middleware for it with that specific method
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);