const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: String,
    registrationDate: String,
    friends: [String],
    name: String,
    profilePicture: String,
});

module.exports = mongoose.model("user", userSchema);
