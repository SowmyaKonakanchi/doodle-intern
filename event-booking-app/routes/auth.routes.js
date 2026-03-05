const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Forgot password
router.post("/forgot-password", authController.forgotPassword);

// Reset password
router.post("/reset-password", authController.resetPassword);

// Update profile
router.put("/update-profile", authMiddleware, authController.updateProfile);

module.exports = router;