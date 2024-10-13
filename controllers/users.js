const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser);
        req.logIn(registeredUser, (err) => {
            if (err) next(err);
            req.flash("success", `Welcome ${username}`)
            res.redirect("/listings")
        })

    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}


module.exports.login = async (req, res) => {
    req.flash("success", `Logged in successfully ${req.body.username}`)
    redirectUrl = res.locals.redirectUrl;
    if (redirectUrl)
        return res.redirect(redirectUrl);
    res.redirect("/listings")
}


module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err); //passport as a middleware agr fail hogya tb error askta h
        req.flash("success", "You are logged out")
        res.redirect("/listings")
    })
}