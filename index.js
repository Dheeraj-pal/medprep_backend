const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.route");
const { doctorRouter } = require("./routes/doctor.route");
const { meetingRouter } = require("./routes/meeting.route");
const { authenticateToken } = require("./middleware/authentication");
require("dotenv").config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to MEDPREP");
});

app.use("/user", userRouter);

app.use("/doctor", doctorRouter);

app.use(authenticateToken);

app.use("/meeting", meetingRouter);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to db");
    console.log("Server Running on port " + PORT);
  } catch (error) {
    console.log("Error while connecting to DB");
  }
});
