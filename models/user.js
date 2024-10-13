const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email: { type: String, required: true },
    //username and password ko explicitly mention krne ki jarurt ni hai
    //coz passport-local-mongoose apne aap hamare liye krdeta hai mention

})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);