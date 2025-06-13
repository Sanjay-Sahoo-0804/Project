const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { listingSchema } = require("../schema");

const ListingSchema = new Schema({
    title: {
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image: {
       url: String,
       filename: String, 
    },

    price:Number,
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review",
       },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: ["mountains","arctic","farms","deserts"]
    },
});

ListingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;