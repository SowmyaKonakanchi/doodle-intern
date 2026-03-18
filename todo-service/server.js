require("dotenv").config();
const app = require("./src/app");
const { sequelize, connectDB } = require("./src/config/database");
const startReminderCron = require("./src/jobs/reminderCron");

const PORT = process.env.PORT || 3000;
const ALT_PORT = process.env.ALT_PORT || 3001;

function startServer(port, fallback) {
  connectDB().then(() => sequelize.sync({ alter: true })).then(() => {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      startReminderCron();
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE" && fallback) {
        console.log(`Port ${port} is busy, trying ${fallback}...`);
        startServer(fallback);
      } else {
        console.error(err);
      }
    });
  }).catch((err) => {
    console.error("DB connection failed:", err.message);
  });
}

startServer(PORT, ALT_PORT);
