const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logout,
  getUsers,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// register user
router.route("/register").post(registerUser);

// get current user (protected route)
router.route("/me").get(protect, getCurrentUser);
router.route("/users").get(protect, getUsers);

//login
router.route("/login").post(loginUser);

router.route("/logout").get(logout);

module.exports = router;
