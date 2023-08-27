const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, "Set review"],
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Review = model("review", reviewSchema);

module.exports = Review;
