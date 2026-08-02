const express = require("express");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logout,
  getUsers,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Login rate limiter — keyed by the submitted email address (lowercased) so
 * that only the account being targeted is locked out after too many failed
 * attempts.  Falls back to the IP address when no email is present in the
 * body (e.g. a malformed or scripted request) so those are still throttled.
 */
const loginAttemptLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30-minute window
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,

  // Key by email so limits are per-account, not per-IP.
  // Falls back to ipKeyGenerator (IPv6-safe) for requests with no email body.
  keyGenerator: (req) => {
    const email = req.body?.email;
    return email ? `login:${email.toLowerCase().trim()}` : ipKeyGenerator(req);
  },

  message: {
    success: false,
    message:
      "Too many login attempts for this account. Please try again in 30 minutes.",
  },
});

/**
 * Register rate limiter — keyed by IP address to prevent bulk account
 * creation from a single source.
 */
const registerAttemptLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1-hour window
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,

  // Use ipKeyGenerator for proper IPv6 normalisation.
  keyGenerator: ipKeyGenerator,

  message: {
    success: false,
    message:
      "Too many registration attempts from this IP. Please try again in an hour.",
  },
});

// register user
router.route("/register").post(registerAttemptLimiter, registerUser);
// login
router.route("/login").post(loginAttemptLimiter, loginUser);
// logout
router.route("/logout").get(logout);
// get current user (protected route)
router.route("/me").get(protect, getCurrentUser);
router.route("/users").get(protect, getUsers);

module.exports = router;
