const Listing = require("../models/listing");


module.exports.index =async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    console.log("Authenticated user:", req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};


module.exports.createListing = async (req, res, next) => {
    console.log("🌐 ENV CHECK:", process.env.CLOUD_NAME, process.env.CLOUD_API_KEY);
    console.log("📦 FILE RECEIVED:", req.file);
    console.log("📝 BODY DATA:", req.body);

    let { listing } = req.body;

    if (listing.description) {
        listing.description = listing.description.trim();
    }

    listing.image = {};

    if (req.file) {
        listing.image.url = req.file.path;
        listing.image.filename = req.file.filename;

        console.log(" Uploaded Image:");
        console.log("URL:", listing.image.url);
        console.log("Filename:", listing.image.filename);
    } else {
        listing.image.url = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60";
        listing.image.filename = "default_unsplash.jpg";

        console.log("ℹ️ No file uploaded. Using default image.");
    }

    const newListing = new Listing(listing);
    newListing.owner = req.user._id;


    newListing.image = {
        url: listing.image.url,
        filename: listing.image.filename
    };

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    if (req.body.listing.description) {
        req.body.listing.description = req.body.listing.description.trim();
    }
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing  = async (req,res)=>{
    let {id} = req.params; 
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," Listing Deleted!");
    res.redirect("/listings");
};