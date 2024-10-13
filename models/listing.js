const mongoose = require('mongoose');
const Review = require("./review.js");
const { required } = require('joi');
const Schema = mongoose.Schema;


const listingSchema = new Schema({

    title: {
        type: String
    },

    description: String,

    image: {
        // type: String, set: (v) => v === "" ? "https://imgs.search.brave.com/7k-NvPoIu3643AQthiZ7MMregEa7z1ys2WCx8320DL0/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93d3cu/Z2VudXNwbGMuY29t/L21lZGlhLzEyNDIv/cGljLmpwZw" : v,
        // default: "https://imgs.search.brave.com/7k-NvPoIu3643AQthiZ7MMregEa7z1ys2WCx8320DL0/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93d3cu/Z2VudXNwbGMuY29t/L21lZGlhLzEyNDIv/cGljLmpwZw"
        // // type: String, set: (v) => v==="" ? "default link" :v,
        url: String,
        filename: String,
    },

    price: Number,
    location: String,
    country: String,

    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    }
});



listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;