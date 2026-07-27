const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
      indexed: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: [true, "Comment message is required"],
      trim: true,
      maxlength: [500, "Comment message cannot exceed 500 characters"],
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
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
        fileSize: {
          type: Number,
        },
        mineType: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false, // Disable the __v field
  },
);

// Mark comment as edited and update the editedAt timestamp
commentSchema.pre("save", function (next) {
  this.set({
    isEdited: true,
    editedAt: new Date(),
  });

  next();
});

// indexes for faster queries
commentSchema.index({ issue: 1, createdAt: 1 });
commentSchema.index({ author: 1 });

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
