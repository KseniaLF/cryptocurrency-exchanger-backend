const registerSchema = require("./auth/register");
const verifySchema = require("./auth/verify");

const { loginSchema, refreshSchema } = require("./auth/login");

const reviewSchema = require("./review/review");
const reviewStatusSchema = require("./review/reviewStatus");

const transactionSchema = require("./transaction/transaction");
const transactionStatusSchema = require("./transaction/transactionStatus");

const captchaSchema = require("./captcha/captcha");

module.exports = {
  registerSchema,
  verifySchema: verifySchema.verifySchema,
  resendVerifySchema: verifySchema.resendVerifySchema,
  passwordResetSchema: verifySchema.passwordResetSchema,
  loginSchema,
  refreshSchema,
  reviewSchema,
  reviewStatusSchema,
  transactionSchema,
  transactionStatusSchema,
  captchaSchema,
};
