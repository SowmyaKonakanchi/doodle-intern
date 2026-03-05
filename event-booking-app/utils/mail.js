const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sowmyakonakanchi7@gmail.com",
    pass: "enmenbuuwsqfjwhv"
  }
});

const sendMail = async (to, subject, text) => {
  try {

    await transporter.sendMail({
      from: "sowmyakonakanchi7@gmail.com",
      to: to,
      subject: subject,
      text: text
    });

    console.log("Email sent successfully");

  } catch (error) {

    console.log("Email error:", error);

  }
};

module.exports = sendMail;