// Index route
const express = require("express");
const router = express.Router();
const issueRoutes = require("./issueRoutes");
const authRoutes = require("./authRoutes");

router.use("/issues", issueRoutes);
router.use("/auth", authRoutes);

module.exports = router;
