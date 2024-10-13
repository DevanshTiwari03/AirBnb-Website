const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js")
// const upload = multer({ dest: "uploads/" })//upload name ke folder me automatically upload krdega
const upload = multer({ storage })

//index route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing));   //creating new listing

// .post(upload.single('listing[image]'),//means single file save kararhe h upload folder me and with the fieldname listing[image]
//     (req, res) => {
//         console.log(req.body);
//         res.send(req.file)
//     }) //new parameter req.file 


//new route
router.get('/new', isLoggedIn, wrapAsync(listingController.renderNewForm));
//new route ko upr rakha hai taaaki new ko id ki trh interpret na krle

router.route("/:id")
    .get(wrapAsync(listingController.showListing))//show route
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))//update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));//Delete route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));





module.exports = router;