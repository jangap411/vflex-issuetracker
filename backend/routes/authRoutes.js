const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logout,
  getUsers,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Slow down repeated credential attempts from the same IP address.
const authAttemptLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again in 30 minutes.",
  },
});

// register user
router.route("/register").post(authAttemptLimiter, registerUser);
//login
router.route("/login").post(authAttemptLimiter, loginUser);
//logout
router.route("/logout").get(logout);
// get current user (protected route)
router.route("/me").get(protect, getCurrentUser);
router.route("/users").get(protect, getUsers);

module.exports = router;
