const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    name: {
      type: String,
      required: [true, "Name is required"],
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    middleName: {
      type: String,
    },

    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },

    token: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
