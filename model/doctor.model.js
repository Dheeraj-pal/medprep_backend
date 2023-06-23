const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    gender: String,
    age: Number,
    experience: Number,
    specialized: String,
  },
  {
    versionKey: false,
  }
);

const doctorModel = mongoose.model("Doctor", doctorSchema);

module.exports = {
  doctorModel,
};
