const Issue = require("../models/Issue");

/**
 * @desc    Get all issues
 * @route   GET /api/issues
 * @access  Private
 */
const getAllIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find()
      .populate("createdBy", "fullName email avatar")
      .populate("assignedTo", "fullName email avatar")
      .populate("comments.author", "fullName avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single issue by ID
 * @route   GET /api/issues/:id
 * @access  Private
 */
const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("createdBy", "fullName email avatar")
      .populate("assignedTo", "fullName email avatar")
      .populate("comments.author", "fullName avatar");

    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }

    res.status(200).json({ success: true, data: issue });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new issue
 * @route   POST /api/issues
 * @access  Private
 */
const createIssue = async (req, res, next) => {
  try {
    // Extract issue details from the request body
    const {
      title,
      description,
      priority,
      status,
      assignedTo,
      labels,
      dueDate,
      attachments,
    } = req.body;

    const issue = await Issue.create({
      title,
      description,
      priority,
      status,
      assignedTo,
      labels,
      dueDate,
      attachments,
      createdBy: req.user._id,
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate("createdBy", "fullName email avatar")
      .populate("assignedTo", "fullName email avatar")
      .populate("comments.author", "fullName avatar");
    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: populatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing issue
 * @route   PUT /api/issues/:id
 * @access  Private
 */
const updateIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }
    Object.assign(issue, req.body);
    await issue.save();
    const updatedIssue = await Issue.findById(issue._id)
      .populate("createdBy", "fullName email avatar")
      .populate("assignedTo", "fullName email avatar")
      .populate("comments.author", "fullName avatar");
    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update issue status
 * @route   PATCH /api/issues/:id/status
 * @access  Private
 */
const updateIssueStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }
    issue.status = status;
    await issue.save();
    const populatedIssue = await Issue.findById(issue._id)
      .populate("createdBy", "fullName email avatar")
      .populate("assignedTo", "fullName email avatar")
      .populate("comments.author", "fullName avatar");
    res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      data: populatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an issue
 * @route   DELETE /api/issues/:id
 * @access  Private
 */
const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }
    await issue.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Issue deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Issues By Status
 * @route   GET /api/issues/status/:status
 * @access  Private
 */
const getIssuesByStatus = async (req, res, next) => {
  try {
    const issues = await Issue.find({ status: req.params.status })
      .populate("createdBy", "fullName")
      .populate("assignedTo", "fullName")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: issues.length, data: issues });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign Issue
 * @route   PATCH /api/issues/:id/assign
 * @access  Private
 */
const assignIssue = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue not found" });
    }
    issue.assignedTo = assignedTo;
    await issue.save();
    const updatedIssue = await Issue.findById(issue._id)
      .populate("createdBy", "fullName email avatar")
      .populate("assignedTo", "fullName email avatar")
      .populate("comments.author", "fullName avatar");
    res.status(200).json({
      success: true,
      message: "Issue assigned successfully",
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a comment to an issue
 * @route   POST /api/v1/issues/:id/comments
 * @access  Private
 */
const addComment = async (req, res, next) => {
  try {
    const body = req.body.body?.trim();
    if (!body) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    issue.comments.push({ body, author: req.user._id });
    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate("createdBy", "fullName email avatar")
      .populate("assignedTo", "fullName email avatar")
      .populate("comments.author", "fullName avatar");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Dashboard: Summary
 * @route   GET /api/issues/summary
 * @access  Private
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    const total = await Issue.countDocuments();
    const todo = await Issue.countDocuments({ status: "todo" });
    const inProgress = await Issue.countDocuments({
      status: "in_progress",
    });
    const inReview = await Issue.countDocuments({ status: "in_review" });
    const done = await Issue.countDocuments({ status: "done" });
    const highPriority = await Issue.countDocuments({ priority: "High" });
    res.status(200).json({
      success: true,
      data: { total, todo, inProgress, inReview, done, highPriority },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
  getIssuesByStatus,
  assignIssue,
  addComment,
  getDashboardSummary,
};
