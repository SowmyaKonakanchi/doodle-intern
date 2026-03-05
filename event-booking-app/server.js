require("dotenv").config();

const express = require("express");
const sequelize = require("./config/db");

const app = express();


/* -----------------------------
   IMPORT MODELS
----------------------------- */

require("./models/user.model");
require("./models/event.model");
require("./models/booking.model");


/* -----------------------------
   IMPORT ROUTES
----------------------------- */

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");


/* -----------------------------
   EMAIL UTILITY
----------------------------- */

const sendMail = require("./utils/mail");


/* -----------------------------
   MIDDLEWARE
----------------------------- */

app.use(express.json());


/* -----------------------------
   ROUTES
----------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);


/* -----------------------------
   TEST EMAIL ROUTE
----------------------------- */

app.get("/test-mail", async (req, res) => {

  try {

    await sendMail(
      "sowmyakonakanchi7@gmail.com",
      "Test Email",
      "Your Node.js email system is working!"
    );

    res.send("Test email sent successfully");

  } catch (error) {

    console.log("Mail error:", error);

    res.send("Email sending failed");

  }

});


/* -----------------------------
   DATABASE SYNC
----------------------------- */

sequelize.sync()
.then(() => {
  console.log("Database & tables created!");
})
.catch(err => {
  console.log("DB Error:", err);
});


/* -----------------------------
   START SERVER
----------------------------- */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});