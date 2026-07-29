const express = require("express");
const router = express.Router();
const {
  getAllIssues,
  createIssue,
  getIssueById,
  updateIssue,
  deleteIssue,
  getDashboardSummary,
  getIssuesByStatus,
  updateIssueStatus,
  assignIssue,
} = require("../controllers/issueController");

const { protect } = require("../middleware/authMiddleware");

// Protect all routes after this middleware
router.use(protect);

// get all issues and create issue
router.route("/").get(getAllIssues).post(createIssue);
//dashboard
router.route("/dashboard").get(getDashboardSummary);

//issue status
router.route("/status/:status").get(getIssuesByStatus);

router.route("/:id/status").patch(updateIssueStatus);
router.route("/:id/assign").patch(assignIssue);
router.route("/:id").get(getIssueById).put(updateIssue).delete(deleteIssue);

module.exports = router;
