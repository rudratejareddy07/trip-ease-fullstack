const express=require("express");
const router=express.Router();
const path=require("path");
const methodOverride=require("method-override");
const wrapAsync=require("../util/wrapAsync.js");
const ExpressError=require("../util/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../modules/listing.js");
const {isLoggedIn}=require("../middleware.js");





const listingValidate=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(402,errMsg

        );
    }else{
        next();
    }
}

//all listings
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    allListings.forEach((listing) => {
    listing.priceFormatted = listing.price
      ? listing.price.toLocaleString("en-IN")
      : "N/A";
  });
    res.render("listings/index",{allListings});
    
}))


//create route
router.get("/new",isLoggedIn,wrapAsync(async(req,res)=>{
    res.render("listings/new");
}))

//edit route(to show)
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
       req.flash("error", "Listing not exist!");
       return res.redirect("/listings") ;
    }
    res.render("listings/edit",{listing});
}))

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id).populate("review");
     if(!listing){
       req.flash("error", "Listing not exist!");
       return res.redirect("/listings") ;
    }
     if (listing.price != null) {
    listing.price = listing.price.toLocaleString('en-IN');
  } else {
    listing.price = 'N/A';
  }
   
    
    res.render("listings/show",{listing});
}))
//update listing(after editing)
router.put("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const newListing=await Listing.findByIdAndUpdate(id,req.body.listing);
    req.flash("success","Listing edited successfully ");
    res.redirect("/listings");

}))
router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const newListing=await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
    

}))
//new listing
router.post("/",isLoggedIn,wrapAsync(async(req,res,next)=>{
    console.log("BODY RECEIVED:", req.body);
    if(!req.body.listing){
        throw new ExpressError(400,"bad request");  //hopscotch-postreq-/listings ;similar thing can be dodne at update listing where req.body used
    }
    
    const {title,description,image,price,country,location}=req.body.listing;
    const newListing=new Listing({
        title,description,image,price,country,location
    })
    console.log(newListing);
    await newListing.save();
    req.flash("success","new listing created");
   res.redirect("/listings");

}))
//logout
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
})



module.exports= router

