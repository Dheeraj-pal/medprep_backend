const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { doctorModel } = require("../model/doctor.model");
require("dotenv").config();
const KEY = process.env.KEY;

const doctorRouter = express.Router();

doctorRouter.get("/", async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    if (doctors) {
      res.send(doctors);
    }
  } catch (error) {
    res.status(500).send({ error: "Error while getting doctors" });
  }
});

//Get Doctor by ID
doctorRouter.get("/getDoctorID", async (req, res) => {
  try {
    const name = req.headers.name;
    const user = await doctorModel.findOne({ name });
    res.send({ ID: user._id });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .send({ error: "An error occurred while retrieving the doctor ID" });
  }
});

// Doctor registration
doctorRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, specialized, gender, experience, age } =
      req.body;

    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newDoctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      gender,
      age,
      experience,
      specialized,
    });

    await newDoctor.save();

    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Doctor login
doctorRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const passwordMatch = await bcrypt.compare(password, doctor.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: doctor._id }, KEY);
    res.json({ message: "Login Successful", token, doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a Doctor
doctorRouter.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await doctorModel.findByIdAndDelete(id);
    res.send({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .send({ error: "An error occurred while deleting the doctor" });
  }
});

module.exports = { doctorRouter };
