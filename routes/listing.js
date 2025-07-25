const express=require("express");
const router=express.Router();
const path=require("path");
const methodOverride=require("method-override");
const wrapAsync=require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../modules/listing.js");
const {isLoggedIn,isOwner,listingValidate}=require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });
const geocode=require("../util/geocode");


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
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
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
   const listing = await Listing.findById(id).populate({
    path: "review",
    populate: { path: "author" }
  })
  .populate("owner");

     if(!listing){
       req.flash("error", "Listing not exist!");
       return res.redirect("/listings") ;
    }
    listing.review = listing.review.filter(
    (r) => r !== null && r !== undefined && r.author !== null && r.author !== undefined
  );
     if (listing.price != null) {
    listing.price = listing.price.toLocaleString('en-IN');
  } else {
    listing.price = 'N/A';
  } 
  const lat = listing.coordinates?.coordinates[1];
const lng = listing.coordinates?.coordinates[0];
   
    res.render("listings/show",{listing,lat, lng});
}))
//update listing(after editing)
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),listingValidate,wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,req.body.listing);
    if (typeof req.file !== 'undefined') {
      const url = req.file.path;
      const filename = req.file.filename;
      listing.image = { url, filename };
      console.log("✅ Image updated:", url, filename);
      await listing.save();
    }
    
    req.flash("success","Listing edited successfully ");
    res.redirect(`/listings/${id}`);

}))
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    const {id}=req.params;
    
    const newListing=await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
    

}))
//new listing
router.post("/",isLoggedIn, upload.single("listing[image]"),listingValidate,wrapAsync(async(req,res,next)=>{
    console.log("📦 Received body:", req.body);
    console.log("📸 Received file:", req.file);
    
    
    if(!req.body.listing){
        throw new ExpressError(400,"bad request");  //hopscotch-postreq-/listings ;similar thing can be dodne at update listing where req.body used
    }
    
    const {title,description,price,country,location}=req.body.listing;
    const newListing=new Listing({
        title,description,price,country,location
    })
    const geoData = await geocode(newListing.location);
if (geoData) {
  newListing.coordinates = geoData;
  console.log(" Coordinates set:", geoData);
}
    newListing.owner=req.user._id; //req.user._id from passport
    if (req.file) {
      const url = req.file.path;
      const filename = req.file.filename;
      newListing.image = { url, filename };
      console.log("✅ Image saved:", url, filename);
    }
    console.log(newListing);
    await newListing.save();
    req.flash("success","new listing created");
   res.redirect("/listings");

}))

module.exports= router

