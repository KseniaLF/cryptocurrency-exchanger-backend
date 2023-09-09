const { Schema, model } = require("mongoose");

const captchaSchema = new Schema(
  {
    secret: {
      type: String,
      required: true,
    },
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
