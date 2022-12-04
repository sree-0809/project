const express = require('express');
const app = express();
const port = 3000;
const request = require('request');
const bodyparser = require("body-parser");

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./ServiceAccountKey.json");

initializeApp({
    credential: cert(serviceAccount),
}); 

const db = getFirestore();
 
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render('start.ejs');
 });

 app.get("/login", (req, res) => {
    res.render('login');
 }); 
 

app.get('/loginsubmit', (req, res) => {
    const email = req.query.email;
    const password = req.query.password;

    db.collection("user")
        .where("email", "==", email)
        .where("password", "==", password)
        .get()
        .then((doc) => {
            if(doc.size>0){
                res.render("index");
            }else{
                res.render("Login_signup_failed");
            }
        });
        
 });

 

 app.get("/signup", (req, res) => {
    res.render('signup');
 });

 app.get('/signupsubmit', (req, res) => {
    
    const user_name = req.query.name;
    const email = req.query.email;
    const password = req.query.password;
    const con_password = req.query.Cpassword;
    
    //Adding data to the collection
    if(password == con_password){
        db.collection('user')
        .add({
            name: user_name,
            email:email,
            password: password,
        })
        .then(() => {
            res.render("login");
        });

    }else{
        res.render("Login_signup_failed");
    }
});




 app.listen(port, () => {
    console.log(`Your APP is running in the port ${port}`);
})
