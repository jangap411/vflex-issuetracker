const mongoose = require("mongoose");

const labelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Label name is required"],
      trim: true,
      unique: true,
      maxlength: 50,
    },
    color: {
      type: String,
      required: [true, "Label color is required"],
      default: "#3B82F6",
      match: [
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        "Please provide a valid hex color",
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// indexes
labelSchema.index({ name: 1 }, { unique: true });

const Label = mongoose.model("Label", labelSchema);
module.exports = Label;
