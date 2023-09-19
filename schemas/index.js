const {
  verifySchema,
  passwordResetSchema,
  resendVerifySchema,
} = require("./auth/verify");

const { registerSchema, loginSchema, refreshSchema } = require("./auth/auth");

const reviewSchema = require("./review/review");
const reviewStatusSchema = require("./review/reviewStatus");

const transactionSchema = require("./transaction/transaction");
const transactionStatusSchema = require("./transaction/transactionStatus");

const captchaSchema = require("./captcha/captcha");

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  verifySchema,
  resendVerifySchema,
  passwordResetSchema,

  reviewSchema,
  reviewStatusSchema,
  transactionSchema,
  transactionStatusSchema,
  captchaSchema,
};
