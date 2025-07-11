const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // for EJS layouts
const wrapAsync = require("./util/wrapAsync.js");
const ExpressError = require("./util/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Listing = require("./modules/listing.js");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modules/user.js");
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const {isLoggedIn}=require("./middleware.js");
// Connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));

// View engine and views folder setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware for parsing, static files, and method override
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Session setup
app.use(session({
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}));

// Flash setup
app.use(flash());

// Passport setup (after session)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set flash messages globally
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
  next();
});

// Validation middleware
const listingValidate = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// Root route
app.get("/", (req, res) => {
  res.send("I am root");
});

app.get("/demouser",async(req,res)=>{
  let fakeUser=new User({
    email:"rudra@gmail.com",
    username:"rudra"
  })
  let registeredUser=await User.register(fakeUser,"helloworld");
  res.send(registeredUser);
})
// Mount routes
app.use("/", userRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found..."));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something unknown error" } = err;
  res.status(statusCode).render("./listings/error.ejs", { statusCode, message });
});

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
