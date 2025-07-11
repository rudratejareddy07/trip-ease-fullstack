const express=require("express");
const router=express.Router({mergeParams:true});//to pass req.params id's to another files
const path=require("path");
const methodOverride=require("method-override");
const wrapAsync=require("../util/wrapAsync.js");
const ExpressError=require("../util/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../modules/listing.js");
const Review=require("../modules/review.js");
const { isLoggedIn,saveRedirectUrl,isLoggedInForReview,isReviewAuthor } = require("../middleware.js");

//review validation
const reviewValidate=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(402,errMsg);
    }else{
        next();
    }
}
//create new review
//reviews post route
router.post("/",isLoggedInForReview ,reviewValidate,wrapAsync(async(req,res)=>{
    
    let listing=await Listing.findById(req.params.id);
    
    let newReview=new Review(req.body.review);
   
    newReview.author = req.user._id;
    await newReview.save();
   
    
    listing.review.push(newReview._id);
   
    
    await listing.save();
    req.flash("success","New review added");
    res.redirect(`/listings/${listing._id}`)
}))
//review deletion
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    const{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
     res.redirect(`/listings/${id}`);
}))

module.exports=router;