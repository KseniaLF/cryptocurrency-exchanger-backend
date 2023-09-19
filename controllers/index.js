const authController = require("./auth");
const reviewController = require("./review");
const transactionController = require("./transaction");
const captchaController = require("./captcha");
const tickerController = require("./ticker");
const chatController = require ("./chat")

module.exports = {
  authController,
  reviewController,
  transactionController,
  captchaController,
  tickerController,
  chatController
};
