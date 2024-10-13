const express = require("express");
const router = express.Router({ mergeParams: true }); //parent file ki jo id variable hai req.params usko yha tk lane ke liye
//ya merge krne ke liye we use mergeParams:true
const wrapAsync = require('../utils/wrapAsync.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.delete("/:revId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview))


module.exports = router;