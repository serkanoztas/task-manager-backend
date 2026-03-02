const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
    res.send("User Routes are working"); 
})

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).send({ user, message: "User Created Successfully" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }

})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Unable to login, user not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Unable to login, invalid credantials");
        }

        const token = jwt.sign({
            _id: user._id.toString()
        }, process.env.JWT_SECRET_KEY)

        res.send({ user, token, message: "Logged in successfully" });

    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})

module.exports = router;