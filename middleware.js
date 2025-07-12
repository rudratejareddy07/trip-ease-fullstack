const ExpressError=require("./util/ExpressError.js");
const Listing = require("./modules/listing");
const Review = require("./modules/review");
const {listingSchema,reviewSchema}=require("./schema.js");



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must log in");
        return res.redirect("/login");
    }
    next();
};
module.exports.isLoggedInForReview = (req, res, next) => {
    if (!req.isAuthenticated()) {
        const { id } = req.params;
        req.session.redirectUrl = `/listings/${id}`;
        req.flash("error", "You must log in");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; // Clear it after saving to locals
    }
    next();
};

module.exports.isOwner =async(req,res,next)=>{
    const { id } = req.params;
    let listing=await Listing.findById(id);
    if(!res.locals.currUser || !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.listingValidate=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(402,errMsg

        );
    }else{
        next();
    }
}
module.exports.isReviewAuthor =async(req,res,next)=>{
    const { id,reviewId } = req.params;
    let review=await Review.findById(reviewId);
    console.log("reviewauthor debugging");
    if ( !res.locals.currUser ||!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};