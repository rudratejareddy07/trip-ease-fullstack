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
const reviewController = require ("../controllers/review.js");

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

//reviews post route
router.post("/",isLoggedInForReview ,reviewValidate,wrapAsync(reviewController.createReview));
//review deletion
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;