const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  forgotPassword,
  resetPassword,
  getProfile,
  logoutAdmin,
} = require("../controllers/adminAuth");

const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/profile", protect, getProfile);
router.post("/logout", protect, logoutAdmin);

module.exports = router;
