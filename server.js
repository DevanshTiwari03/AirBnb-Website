// app.get('/testListing', async (req, res) => {
//     let sampleListing = new Listing({
//         title: 'My New Villa',
//         description: 'By the beach',
//         price: 1200,
//         location: "calangute,goa",
//         country: 'india'
//     });

//     await sampleListing.save();
//     console.log("sample was saved successfully");
//     res.send("successful sampleListing");
// });


if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require('./utils/ExpressError.js');
const app = express();
const lisRoutes = require("./routes/listing.js")
const revRoutes = require("./routes/review.js")
const userRoutes = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");
const { error } = require("console");
const dbUrl = 'mongodb://127.0.0.1:27017/wanderlust';

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET || 'thisisasecret'
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", error);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET || 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true   //to avoid cross scripting attacks
    },
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//telling passport konsi strategy use krni h
passport.serializeUser(User.serializeUser());// when user is logged in uski info store karani padhti h session me that is serializing user...taaki baar baar login na krna  pade..untill session is closed
passport.deserializeUser(User.deserializeUser());// when user is logged out uski  info unstore karani padhti h session me that is deserializing user


async function main() {
    await mongoose.connect(dbUrl)
}
main().then((res) => {
    console.log("connection established");
}).catch((err) => { console.log("connection is not successful "); });

app.listen(8080, (req, res) => {
    console.log("listening on port 8080");
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");;
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();

})


// app.get("/demouser", async (req, res) => {

//     let fakeUser = new User({
//         email: "student@yahooo.com",
//         username: "rishi"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");// 

//     console.log(registeredUser);
//     res.send(registeredUser);

// })

app.get('/', (req, res) => {
    res.redirect('/listings')
});

app.use("/listings", lisRoutes);
app.use("/listings/:id/reviews", revRoutes); //id yhi rh jaati hai and review file tk ni jaati 
//isiliye params ko merge krna padhta hai server and router file tk so we use mergeParams:true
app.use("/", userRoutes);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "no valid path found"))
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Page not found" } = err;
    res.status(status).render("error.ejs", { message: message });
})