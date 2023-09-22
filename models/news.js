const { Schema, model } = require("mongoose");

const newsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title"],
    },
    description: {
      type: String,
      required: [true, "Set description"],
    },
    content: {
      type: String,
    },
    tag: {
      type: String,
    },
    image: {
      type: String,
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

const News = model("news", newsSchema);

module.exports = News;
