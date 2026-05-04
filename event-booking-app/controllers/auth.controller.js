const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const sendMail = require("../utils/mail");
const geocoder = require("../utils/geocoder");


/* ================= REGISTER ================= */

exports.register = async (req, res) => {

  try {

    const { name, email, password, area, city, state, country } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const address = `${area}, ${city}, ${state}, ${country}`;

    const geoData = await geocoder.geocode(address);

    const latitude = geoData[0]?.latitude || null;
    const longitude = geoData[0]?.longitude || null;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      area,
      city,
      state,
      country,
      latitude,
      longitude
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



/* ================= LOGIN ================= */

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



/* ================= FORGOT PASSWORD ================= */

exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(400).json({ message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendMail(
      email,
      "Password Reset OTP",
      `Your OTP is ${otp}. It expires in 10 minutes.`
    );

    res.json({ message: "OTP sent to email" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



/* ================= RESET PASSWORD ================= */

exports.resetPassword = async (req, res) => {

  try {

    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (new Date() > user.otpExpiry)
      return res.status(400).json({ message: "OTP expired" });

    const isOtpValid = await bcrypt.compare(otp, user.otp);

    if (!isOtpValid)
      return res.status(400).json({ message: "Invalid OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



/* ================= CHANGE PASSWORD ================= */

exports.changePassword = async (req, res) => {

  try {

    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



/* ================= UPDATE PROFILE ================= */

exports.updateProfile = async (req, res) => {

  try {

    const user = await User.findByPk(req.user.id);

    const { name, area, city, state, country } = req.body;

    const address = `${area}, ${city}, ${state}, ${country}`;

    const geoData = await geocoder.geocode(address);

    const latitude = geoData[0]?.latitude;
    const longitude = geoData[0]?.longitude;

    user.name = name || user.name;
    user.area = area || user.area;
    user.city = city || user.city;
    user.state = state || user.state;
    user.country = country || user.country;
    user.latitude = latitude || user.latitude;
    user.longitude = longitude || user.longitude;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};