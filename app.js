require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const encrypt = require("mongoose-encryption"); 2
// const md5 = require('md5'); 3
// const bcrypt= require('bcrypt') 4
const session = require('express-session');
const passport = require('passport');
const passportLM = require('passport-local-mongoose');

const app = express();




// const salt = 10; 4

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//TODO
mongoose.connect(process.env.DB, {useNewUrlparser: true});

 const UserSchema = new mongoose.Schema ({
    email: String,
    password: String
 })


//  UserSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

UserSchema.plugin(passportLM);


 const User = mongoose.model("User",UserSchema)

 passport.use(User.createStrategy());

 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
 



app.get("/", function(req, res){
    res.render('home')
    });



app.route("/login")    

.get(function(req, res) {
    res.render('login')
})


.post(function(req, res) {
    
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })

  req.login(user, function(err) {
    if (err) {
console.log(err);
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/secrets');
    })
}
});
    
});




app.route('/register')

.get(function(req, res) {
    res.render('register')
})

.post(function(req, res) {

  User.register({username: req.body.username}, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/secrets');
      })
    }
  })

    });


app.route('/secrets')    

.get(function(req, res) {
  if (req.isAuthenticated()){
    res.render('secrets')
  } else {
    res.redirect('/login')
  }
})
    

  
app.route('/logout')
.get(function(req, res) {
  req.logOut(function(err){
    if(err){ return next(err)
  }});
  res.redirect("/");
});   


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
