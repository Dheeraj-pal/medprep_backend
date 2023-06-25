const nodemailer = require("nodemailer");

const sendMail = async () => {
  const transporter = await nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "zoie.tillman@ethereal.email",
      pass: "ACHWVutXjXZfwDgAcP",
    },
  });

//   let info = await transporter.sendMail({
//     from
//   })
};

module.exports = sendMail;
