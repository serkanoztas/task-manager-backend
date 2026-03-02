const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
require("dotenv").config();

const Database = require("./db");
const db = new Database();
db.connect();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use("/users", userRoutes);  //user a istek gelirse userRouter i çalıştır
app.use("/tasks", taskRouter);

app.get("/", (req, res) => {
    res.json({
        message: "Task Manager Api is Working!"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})