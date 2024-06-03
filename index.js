const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const Set = require("./schemas/setSchema");
const User = require("./schemas/userSchema");
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.post("/addSet", async (req, res) => {
    const estimatedMax = req.body.weight / (1.0278 - 0.0278 * req.body.reps);
    const weight =
        req.body.unit === "kg"
            ? req.body.weight * 2.2046226218
            : req.body.weight;
    const data = new Set({ ...req.body, estimatedMax, weight });
    const result = await data.save();
    res.send(result);
});
app.get("/dashboard/:id", async (req, res) => {
    const id = req.params.id;
    const data = {};

    // Get maxes for each lift
    data.squatMax = await Set.findOne({ userId: id, lift: "Squat" })
        .sort("-estimatedMax")
        .select("reps weight estimatedMax date");
    data.benchMax = await Set.findOne({ userId: id, lift: "Bench Press" })
        .sort("-estimatedMax")
        .select("reps weight estimatedMax date");
    data.deadliftMax = await Set.findOne({ userId: id, lift: "Deadlift" })
        .sort("-estimatedMax")
        .select("reps weight estimatedMax date");

    // Get logs for each lift
    data.squatLogs = await Set.find({ userId: id, lift: "Squat" })
        .sort("-date")
        .limit(10);
    data.benchLogs = await Set.find({ userId: id, lift: "Bench Press" })
        .sort("-date")
        .limit(10);
    data.deadliftLogs = await Set.find({ userId: id, lift: "Deadlift" })
        .sort("-date")
        .limit(10);

    console.log(data);
    res.send(data);
});
app.post("/user/createUser", async (req, res) => {
    const data = new User({ ...req.body });
    const result = await data.save();
    res.send(result);
});
main()
    .then(() => console.log("Connected to db"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(
        "mongodb+srv://stuart:password1234@prtracker.omiugdr.mongodb.net/?retryWrites=true&w=majority&appName=PRTRACKER"
    );
}
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
