const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); //decoded a token ın id si döner
        const user = await User.findOne({ _id: decoded._id });
        if (!user) {
            throw new Error("Unable to login, invalid credantials")
        }
        req.user = user; //requset e yeni bir user field ekler sonraki middleware da buna ulaşırım db de tekrar soruya gerek yok
        req.token = token;
        next();

    } catch (err) {
        res.status(401).send({ error: err.message })
    }
}

module.exports = auth;