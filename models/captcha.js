const { Schema, model } = require("mongoose");

const captchaSchema = new Schema(
  {
    response: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Captcha = model("captcha", captchaSchema);

module.exports = Captcha;
