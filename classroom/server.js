const express=require("express");
const app=express();
const session=require("express-session");
const flash = require('connect-flash');
const path = require("path");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
    session({
        secret:"mysupersecretstring",
        resave:false,
        saveUninitialized:true
    })
);
app.use(flash());
app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.session.name=name;
     req.flash('success', 'user registered');
    res.redirect("/test");  
})
app.get("/test",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1}
    console.log("test route trigered")
    // res.send(`request ${req.session.count}`);
    res.render("page.ejs",{name:req.session.name,msg:req.flash('success')})
})

app.listen(3000,()=>{
    console.log("server is listening to 3000");
})