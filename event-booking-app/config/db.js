const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("event_db", "root", "Sowmya@15", {
  host: "localhost",
  dialect: "mysql"
});

sequelize.authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((err) => console.error("Unable to connect:", err));

module.exports = sequelize;