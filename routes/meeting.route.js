const express = require("express");
const { meetModel } = require("../model/meeting.model");
const { doctorModel } = require("../model/doctor.model");
const { userModel } = require("../model/user.model");

const meetingRouter = express.Router();

//get all meetings
meetingRouter.get("/", async (req, res) => {
  try {
    const meetings = await meetModel.find();
    res.send(meetings);
  } catch (error) {
    res.status(500).send({ message: "cannot retrieve all meeting data" });
  }
});

// Schedule a meeting/appointment
meetingRouter.post("/schedule", async (req, res) => {
  try {
    const {
      doctorId,
      patientId,
      patientName,
      doctorName,
      patientEmail,
      dateAndTime,
      contact,
      specialization,
      symptoms,
      roomId,
    } = req.body;

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const patient = await userModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const newMeeting = new meetModel({
      doctorId: doctorId,
      patientId: patientId,
      patientName,
      doctorName,
      patientEmail,
      dateAndTime,
      contact,
      specialization,
      symptoms,
      roomId,
    });

    await newMeeting.save();

    res.status(201).json({ message: "Meeting scheduled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Reschedule a meeting/appointment
meetingRouter.put("/reschedule/:meetingId", async (req, res) => {
  try {
    const meetingId = req.params.meetingId;
    const { startTime, endTime } = req.body;

    const meeting = await meetModel.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    if (
      meeting.doctorId.toString() !== req.body.doctorId &&
      meeting.patientId.toString() !== req.body.patientId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    meeting.startTime = startTime;
    meeting.endTime = endTime;
    await meeting.save();

    res.json({ message: "Meeting rescheduled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Cancel a meeting/appointment
meetingRouter.delete("/:meetingId", async (req, res) => {
  try {
    const meetingId = req.params.meetingId;

    const meeting = await meetModel.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    if (
      meeting.doctorId.toString() !== req.body.doctorId &&
      meeting.patientId.toString() !== req.body.patientId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await meetModel.findByIdAndDelete(meetingId);

    res.json({ message: "Meeting canceled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  meetingRouter,
};
