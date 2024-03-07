var express = require('express');
var router = express.Router();
var userModel = require("./users")
var postModel = require("./post")
const passport = require('passport');
const localStrategy = require("passport-local");
const upload =require("./multer")

passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username:req.session.passport.user,
  }).populate("posts")
  
  
  res.render("profile",{user});
});

router.get("/login",(req,res)=>{
  res.render("login",{error: req.flash('error')})
})
router.get("/feed",isLoggedIn,async(req,res)=>{
  const user = await userModel.findOne({
    username:req.session.passport.user,
  })
  res.render("feed",{user} )
})
router.post("/upload", isLoggedIn,upload.single("file"), async (req,res)=>{
  if(!req.file){
    return res.status(404).send("no file were given")
  }
 
  const user = await userModel.findOne({username:req.session.passport.user})
   const postData = await postModel.create({
    image:req.file.filename,
    imageText:req.body.filecaption,
    user:user._id
  })

   user.posts.push(postData._id)
   await user.save()
   res.redirect("/profile")
})


router.post('/register', function(req, res, next) {
  const { username, email, fullName, password } = req.body;
  const newUser = new userModel({ username, email, fullName });
  userModel.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.error(err);
      return res.redirect('/register'); // Redirect to registration page on error
    }
    passport.authenticate('local')(req, res, function() {
      
      res.redirect('/feed');
    });
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/feed",
  failureRedirect: "/login",
  failureFlash:true
}));

router.get("/logout", function(req, res, next) {
  req.logout((err)=>{
    if(err){ return next(err)}
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
