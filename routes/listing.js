const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsyc.js");
const {isLoggedIn,isOwner,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage});
// const cloudConfig = require('./cloudConfig');


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );



// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(
    isLoggedIn,isOwner,
    wrapAsync(listingController.destroyListing )
);

// Edit route
router.get("/:id/edit",isLoggedIn,isOwner,
    wrapAsync(listingController.renderEditForm)
);


module.exports = router;


// // index route
// router.get("/",wrapAsync(listingController.index));



// // show route
// router.get("/:id",
//     wrapAsync(listingController.showListing)
// );


// // CREATE ROUTE
// router.post("/",isLoggedIn, validateListing,
//   wrapAsync(listingController.createListing));

// update route
// router;

// // DELETE ROUTE
// router.delete("/:id",
//     isLoggedIn,isOwner,
//     wrapAsync(listingController.destroyListing )
// );
