const Listing=require("../modules/listing");
const Review=require("../modules/review");

module.exports.createReview= async(req,res)=>{
    console.log("Received review:", req.body);
    let listing=await Listing.findById(req.params.id);
    req.body.review.rating = parseInt(req.body.review.rating);
    let newReview=new Review(req.body.review);
   
    newReview.author = req.user._id;
    await newReview.save();
   
    
    listing.review.push(newReview._id);
   
    
    await listing.save();
    req.flash("success","New review added");
    res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview=async(req,res)=>{
    const{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
     res.redirect(`/listings/${id}`);
}