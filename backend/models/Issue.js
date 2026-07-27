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
      required: [true, "Description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["TO DO", "IN PROGRESS", "DONE"],
      default: "TO DO",
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// update completedAt when status is changed to "Closed"
issueSchema.pre("save", function (next) {
  if (this.status === "DONE" && !this.completedAt) {
    this.completedAt = new Date();
  }

  if (this.status !== "DONE") {
    this.completedAt = null;
  }

  next();
});

// virtual: isOverdue
issueSchema.virtual("isOverdue").get(function () {
  return this.dueDate && this.status !== "DONE" && this.dueDate < new Date();
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
