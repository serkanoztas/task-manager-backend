const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
},
{
    timestamps: true
})

userSchema.pre("save", async function (next) {  //pre save belge db ye kaydedilmeden önce çalışır await user.save() işeminden önce çalışır
    const user = this;

    //password değişti mi kontrolü
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

})

const User = mongoose.model("User", userSchema);
module.exports = User;