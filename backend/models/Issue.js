const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      // These values match the Kanban columns used by the frontend.
      enum: ["todo", "in_progress", "in_review", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    labels: [
      {
        type: String,
        trim: true,
        maxlength: [30, "Label cannot exceed 30 characters"],
      },
    ],
    dueDate: {
      type: Date,
      default: null,
    },
    attachments: [
      {
        fileName: {
          type: String,
        },
        fileUrl: {
          type: String,
        },
      },
    ],
    comments: [
      {
        body: {
          type: String,
          required: true,
          trim: true,
          maxlength: [2000, "Comment cannot exceed 2000 characters"],
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

issueSchema.pre("save", function () {
  if (this.status === "done" && !this.completedAt)
    this.completedAt = new Date();
  if (this.status !== "done") this.completedAt = null;
});

// virtual: isOverdue
issueSchema.virtual("isOverdue").get(function () {
  return this.dueDate && this.status !== "done" && this.dueDate < new Date();
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
