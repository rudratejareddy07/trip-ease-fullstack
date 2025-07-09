const express=require("express");
const router=express.Router({mergeParams:true});//to pass req.params id's to another files
const path=require("path");
const methodOverride=require("method-override");
const wrapAsync=require("../util/wrapAsync.js");
const ExpressError=require("../util/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../modules/listing.js");
const Review=require("../modules/review.js");

//review validation
const reviewValidate=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(402,result.error);
    }else{
        next();
    }
}

//reviews post route
router.post("/",reviewValidate,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`)
}))
//review deletion
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    const{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
     res.redirect(`/listings/${id}`);
}))

module.exports=router;