const express=require("express");
const router=express.Router();
const path=require("path");
const User=require("../modules/user.js")
const passport=require("passport")
const{saveRedirectUrl}=require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")

})
router.post("/signup",async(req,res)=>{
    try{let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const regUser=await User.register(newUser,password);
    console.log(regUser);
    req.login(regUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Trip-Ease!");
        res.redirect("/listings");
    })
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }

})
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",(req, res, next) => {
        console.log("Login attempt for:", req.body.username);
        next();
    },saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
    if(error){
        console.log(error);
    }
    }),
    
    (req, res, next) => {
    console.log("Login hit. User is:", req.user); 
    next();
    },
   
    async(req,res)=>{
        const redirectUrl = res.locals.redirectUrl || "/listings";
        req.flash("success","Welcome back to Trip-ease");
        res.redirect(redirectUrl);
})
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
})
module.exports=router;