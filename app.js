require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const md5 = require('md5');
const bcrypt= require('bcrypt')
const app = express();

const salt = 10;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect(process.env.DB, {useNewUrlparser: true});

 const UserSchema = new mongoose.Schema ({
    email: String,
    password: String
 })


//  UserSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});


 const User = mongoose.model("User",UserSchema)



app.get("/", function(req, res){
    res.render('home')
    });



app.route("/login")    

.get(function(req, res) {
    res.render('login')
})


.post(function(req, res) {
    const email = req.body.username;
    const password = req.body.password;

    console.log(email);
    console.log(password);

    User.findOne({email: email}, function(err, foundUser){
        if (err) {
          console.log(err);
        } else {
          if (foundUser) {
            console.log(foundUser);

            bcrypt.compare(password, foundUser.password, function(err, result) {
              if (result === true ) {
                res.render("secrets");
                console.log(err)
                console.log(result);
              } else{
                console.log(err);
                console.log(result);
              }
            });
          }
        }
      });
    
});


// app.post("/login", function(req, res){
//   const username = req.body.username;
//    	  const password = req.body.password;
  
  
//   User.findOne({email: username}, function(err, foundUser){
   
//         console.log(err);
   
//        if (foundUser) {
//     bcrypt.compare(password, foundUser.password, function(err, result) {
//     if (result === true) {
//       res.render("secrets");
//             } else {
//                 console.log(err);
//             }
//           });
//         }	  
//         })
//      });


app.route('/register')

.get(function(req, res) {
    res.render('register')
})

.post(function(req, res) {

    bcrypt.hash(req.body.username, salt, function(err, hash) {
        // Store hash in your password DB.
         const new_user = new User ({
    email: req.body.username,
    password: hash
    
   });
   console.log(new_user);

   new_user.save(function(err) {
    if (err) {
        console.log(err);
    } else {
        res.render("secrets")
    }
   })
})
    });
    

  

   


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
