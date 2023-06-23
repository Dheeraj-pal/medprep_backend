const express = require("express");
const { userModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const KEY = process.env.KEY;

const userRouter = express.Router();


// User Registration
userRouter.post("/register", async (req, res) => {
  const { password, email, name, age, gender } = req.body;
  try {
    const isPresent = await userModel.find({ email });

    if (isPresent.length === 0) {
      // encrypte password and register
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) res.status(401).json({ "errow ": err.message });
        else {
          const newUser = new userModel({
            name,
            email,
            password: hash,
            age,
            gender,
          });
          await newUser.save();
          res.status(200).json({ success: "user registered successfully" });
        }
      });
    } else {
      res.status(404).json({ msg: "user already registered" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// User Login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = jwt.sign({ userID: user._id }, KEY);
        res.send({
          message: "Login Successful",
          token,
          user,
        });
      } else {
        res.status(401).send({ Error: "Wrong Credentials" });
      }
    } else {
      res.status(401).send({ Error: "Wrong Credentials" });
    }
  } catch (error) {
    res.status(500).send({ Error: "Login failed" });
  }
});

// Update User Details
userRouter.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const newdata = req.body;
  try {
    const updatedUser = await userModel.findByIdAndUpdate(id, newdata, {
      new: true,
    });
    res.send({ message: "User Details Updated", user: updatedUser });
  } catch (error) {
    res.status(500).send({ Error: "Update failed" });
  }
});

module.exports = { userRouter };
