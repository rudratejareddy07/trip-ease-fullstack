const express=require("express");
const router=express.Router();
const path=require("path");
const User=require("../modules/user.js")
const passport=require("passport")
const{saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");


router.get("/signup",userController.renderSignupForm);

router.post("/signup",wrapAsync(userController.signup))

router.get("/login",userController.renderLoginForm)

router.post("/login",(req, res, next) => {
        console.log("Login attempt for:", req.body.username);
        next();
    },saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
    }),
    userController.login);

router.get("/logout",userController.logout);
module.exports=router;