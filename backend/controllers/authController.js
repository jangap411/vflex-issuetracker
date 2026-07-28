const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * @desc    Generate JWT token
 * @param   {Object} user - User object
 * @returns {String} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "3d",
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    //get user details from request body
    const { fullName, email, password } = req.body;
    //check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //create new user
    const user = await User.create({
      fullName,
      email,
      password,
    });

    //generate token
    const token = generateToken(user._id);

    //send response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //validate user input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    //include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    //check account status
    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Your account has been disabled" });
    }

    //compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    //update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    //generate jwt token
    const token = generateToken(user._id);

    //send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid user",
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    logout current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

module.exports = { registerUser, loginUser, getCurrentUser, logout };
