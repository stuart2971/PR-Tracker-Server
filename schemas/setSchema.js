const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
    userId: String,
    date: String,
    weight: Number,
    reps: Number,
    lift: String,
    estimatedMax: Number,
});

module.exports = mongoose.model("set", setSchema);
