const registerSchema = require("./auth/register");
const verifySchema = require("./auth/verify");
const loginSchema = require("./auth/login");

const reviewSchema = require("./review/review");
const reviewStatusSchema = require("./review/reviewStatus");

const transactionSchema = require("./transaction/transaction");
const transactionStatusSchema = require("./transaction/transactionStatus");

const captchaSchema = require("./captcha/captcha");

module.exports = {
  registerSchema,
  verifySchema,
  loginSchema,
  reviewSchema,
  reviewStatusSchema,
  transactionSchema,
  transactionStatusSchema,
  captchaSchema,
};
