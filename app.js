require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const md5 = require('md5');
const app = express();

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
    const password = md5(req.body.password);

    console.log(email);
    console.log(password);

    User.findOne({email: email}, function(err, user) {
        if (err){
            console.log(err);
        } else {  
            if (user){  console.log(user.password);
                if (user.password === password){
                    res.render('secrets');
                    console.log(user);
                  
                  
                } 
            }
        }
    });
});





app.route('/register')

.get(function(req, res) {
    res.render('register')
})

.post(function(req, res) {
   const new_user = new User ({
    email: req.body.username,
    password:md5(req.body.password)
   })

   console.log(new_user);

   new_user.save(function(err) {
    if (err) {
        console.log(err);
    } else {
        res.render("secrets")
    }
   })
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
