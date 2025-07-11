const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");//layout engine for EJS .Ex: using => <% %>
const wrapAsync = require("./util/wrapAsync.js");
const ExpressError = require("./util/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Listing = require("./modules/listing.js");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");


//express session
app.use(
    session({
        secret:"mysupersecretstring",
        resave:false,
        saveUninitialized:true,
        cookie:{
          expires:Date.now() + 7*24*60*60*1000,
          maxAge:7*24*60*60*1000,
          httpOnly:true,
        }
    })
);
app.use(flash());

// Mounting routes
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js"); //  include this

// MongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => console.log("DB is connected"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}

// Express Config
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Session & Flash
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());



app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Middleware
const listingValidate = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(402, errMsg); //  fixed
  }
  next();
};

// Routes
app.get("/", (req, res) => {
  res.send("I am root");
});
app.use("/listings", listingRoutes); //  replaced manual routes
app.use("/listings/:id/reviews", reviewRoutes); // mounted review routes

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found..."));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something unknown error" } = err;
  res.status(statusCode).render("./listings/error.ejs", { statusCode, message });
});

// Start server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
