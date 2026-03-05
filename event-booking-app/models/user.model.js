const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  role: {
    type: DataTypes.STRING,
    defaultValue: "USER"
  },

  area: {
    type: DataTypes.STRING
  },

  city: {
    type: DataTypes.STRING
  },

  state: {
    type: DataTypes.STRING
  },

  country: {
    type: DataTypes.STRING
  },

  latitude: {
    type: DataTypes.FLOAT
  },

  longitude: {
    type: DataTypes.FLOAT
  }

});

module.exports = User;