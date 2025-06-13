// if(process.env.NODE_ENV != "production"){
//   require('dotenv').config();
// }
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// 🔐 Cloudinary config using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;


main().then((res)=>{
    console.log("connected to Database");
})
.catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded( {extended:true} ));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const sessionOptions = {
  secret:"mysupersecretstring",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get("/",(req,res)=>{
//     res.send("Hi I am Sanjay!");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.currentUser = req.user; 
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  // console.log("➡️ Middleware sees user:", req.user);
  next();
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.get("/random", (req, res) => {
  res.send("Here’s something random for you!");
});

// app.all("/*", (req, res, next) => {
//   next(new ExpressError(404, "page not found"));
// });

app.use((err, req, res, next) => {
  console.error("💥 ERROR STACK:", err.stack);  // This logs full error details
  const { statusCode = 500 } = err;
  const message = err.message || "Something went wrong";
  res.status(statusCode).render("error.ejs", { err });
});





app.listen(8080,()=>{
    console.log("app is working");
});