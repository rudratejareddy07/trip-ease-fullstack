const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./util/wrapAsync.js");
const ExpressError=require("./util/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Listing=require("./modules/listing.js");
const Review=require("./modules/review.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));


const mongoose=require("mongoose");




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



//routes
app.get("/",(req,res)=>{
    res.send("I amm root");
})
app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);

//error handling
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
this is main
