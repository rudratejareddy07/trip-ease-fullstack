const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./util/wrapAsync.js");
const ExpressError=require("./util/ExpressError.js");
const {listingSchema}=require("./schema.js");

app.engine('ejs',ejsMate);

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));


const mongoose=require("mongoose");
const Listing=require("./modules/listing.js");



const session = require("express-session");
const flash = require("connect-flash");

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});



const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
main().then(()=>{
    console.log("db is connected");
})
.catch(err=>{
    console.log(err);
}
)

async function main(){
    await mongoose.connect(MONGO_URL);
}

const listingValidate=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(402,result.error);
    }else{
        next();
    }
}
app.get("/",(req,res)=>{
    res.send("I amm root");
})
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    allListings.forEach((listing) => {
    listing.priceFormatted = listing.price
      ? listing.price.toLocaleString("en-IN")
      : "N/A";
  });
    res.render("listings/index",{allListings});
    
}))


//create route
app.get("/listings/new",wrapAsync(async(req,res)=>{
    res.render("listings/new");
}))

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
}))

//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
     if (listing.price != null) {
    listing.price = listing.price.toLocaleString('en-IN');
  } else {
    listing.price = 'N/A';
  }
    
    
    res.render("listings/show",{listing});
}))

app.put("/listings/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const newListing=await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect("/listings");

}))
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    const {id}=req.params;
    const newListing=await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
    

}))

app.post("/listings",wrapAsync(async(req,res,next)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"bad request");  //hopscotch-postreq-/listings ;similar thing can be dodne at update listing where req.body used
    }
    
    const {title,description,image,price,country,location}=req.body;
    const newListing=new Listing({
        title,description,image,price,country,location
    })
    console.log(newListing);
    await newListing.save();

   res.redirect("/listings");

}))
// app.get("/listings",(req,res)=>{
//     let sampleListing=new Listing(
//         {
//             title :"sample",
//             description :"sampe desc",
//             price:1000,
//             location:"andhra",
//             country:"india"
//         }
//     )
//     sampleListing.save();
//     console.log("data saved");
//     res.send("data saved ");
// })

app.use((req,res,next)=>{
    next(new ExpressError(409,"Page not found..."))
})
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something unknown error"}=err;
    res.render("./listings/error.ejs",{statusCode,message});
})
app.listen(8080,(req,res)=>{
    console.log("server is running");
})