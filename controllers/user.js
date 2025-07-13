
    module.exports.renderSignupForm=(req,res)=>{
        res.render("users/signup.ejs")
    };
    module.exports.signup=async(req,res)=>{
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

    };
    module.exports.renderLoginForm=(req,res)=>{
        res.render("users/login.ejs");
    };

    module.exports.login = async (req, res) => {
    console.log("Login hit. User is:", req.user);
    const redirectUrl = res.locals.redirectUrl || "/listings";
    console.log("Redirecting to:", redirectUrl);
    req.flash("success", "Welcome back to Trip-ease");
    res.redirect(redirectUrl);
    };
    module.exports.logout=(req,res,next)=>{
        req.logout((err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","you are logged out");
            res.redirect("/listings");
        })
    }