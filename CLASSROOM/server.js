const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(session({secret:"mysupersecretstring",resave:false,saveUninitialized:true}));

app.use(flash());
app.get("/register",(req,res)=>{
    let {name = "anymous"} = req.query;
    req.session.name= name;
    req.flash("success","user registered successgully");
    res.redirect("/hello");;

 });

app.get("/hello",(req,res)=>{
    // res.send(`hello ${req.session.name}`);
    res.locals.message = req.flash("success");
    res.render("page.ejs",{name:req.session.name});
    
});




app.get("/test",(req,res,)=>{
    res.send("test successful");
});

app.get("/request",(req,res)=>{
    if( req.session.count){
         req.session.count++;
    }
    else{
         req.session.count=1;
    }
    res.send(`you send a request ${req.session.count} times `);
});

app.listen(3000,()=>{
    console.log("server is listening is 3000");
});