const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    gender: String,
    age: Number,
    role: { type: String, default: "patient" },
  },
  {
    versionKey: false,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = {
  userModel,
};
