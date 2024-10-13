const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {   // checks current session me user logged in h ki nhi as passport user info save karata h
        req.session.redirectUrl = req.originalUrl; //but passport jaese hi login krte hai redirectUrl ko reset krdeta hai isiliye save bhi karana padega agl se
        //res.locals variables me kyuki passport ke pass access ni h delete krna ka usko
        console.log("req.originalUrl", req.originalUrl);

        req.flash("error", "you must be logged in");
        return res.redirect("/login")
    }
    next();
}
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "you are not the owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, revId } = req.params;
    console.log(revId);
    let review = await Review.findById(revId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)

    // console.log(error);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(400, errorMessage);
    } else { next() }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)

    // console.log(error);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(400, errorMessage);
    } else { next() }
}