const mongoose = require("mongoose");

const meetSchema = mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dateAndTime: Date,
    patientName: String,
    patientEmail: String,
    contact: String,
    specialization: String,
    doctorName: String,
    symptoms: String,
    roomId: String,
  },
  {
    versionKey: false,
  }
);

const meetModel = mongoose.model("meeting", meetSchema);

module.exports = {
  meetModel,
};
