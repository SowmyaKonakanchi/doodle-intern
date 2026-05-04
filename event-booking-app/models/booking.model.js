const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const Event = require("./event.model");

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM("GOING", "CANCELED"),
    defaultValue: "GOING"
  }
});

User.hasMany(Booking);
Booking.belongsTo(User);

Event.hasMany(Booking);
Booking.belongsTo(Event);

module.exports = Booking;