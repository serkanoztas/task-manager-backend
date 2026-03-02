const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const Task = require("../models/task");

//ilk önce auth çalışır doğrulama başarılı olursa router ım çalışmaya başlar
router.get("/test", auth, (req, res) => {
    res.json({
        message: "Task Routes are working",
        user: req.user
    });
})

//get user task
router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        if (!tasks) {
            return res.status(404).json({ message: "Tasks not found" })
        }

        res.status(200).json({ tasks, count: tasks.length, message: "Tasks Fetched Successfully" });

    } catch (err) {
        res.status(400).send({ error: err.message });
    }
})

//get user task by id
router.get("/:id", auth, async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findOne({ _id: taskId, owner: req.user._id });
        if (!task) {
            throw new Error({ message: "task not found" });
        }
        res.status(200).json({ task, message: "Task Fetched Successfully" });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})

//create task
router.post("/add", auth, async (req, res) => {
    try {
        const task = new Task({
            description: req.body.description,
            completed: req.body.completed || false,
            owner: req.user._id
        })
        await task.save();
        res.status(201).json({ task, message: "Task Created Successfully" });


    } catch (err) {
        res.status(400).send({ error: err.message });
    }
})

//update task     //description completed
router.patch("/:id", auth, async (req, res) => {
    const taskId = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    // {
    //     description: sadasdasds,
    //     completed: true,
    //     owner: sdad
    // }
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).json({ message: "Invalid Updates" });
    }
    try {
        const task = await Task.findOne({ _id: taskId, owner: req.user._id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        })

        await task.save();
        res.json({ message: "Task Updated Successfully", task });


    } catch (err) {
        res.status(400).send({ error: err.message });
    }
})


//delete task by id
router.delete("/:id", auth, async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findOneAndDelete({ _id: taskId, owner: req.user._id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.status(200).json({ message: "Task Deleted Successfully" });

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})


//register
//login

module.exports = router;