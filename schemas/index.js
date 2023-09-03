const registerSchema = require("./auth/register");
const loginSchema = require("./auth/login");

const reviewSchema = require("./review/review");
const reviewStatusSchema = require("./review/reviewStatus");

const transactionSchema = require("./transaction/transaction");
const transactionStatusSchema = require("./transaction/transactionStatus");

module.exports = {
  registerSchema,
  loginSchema,
  reviewSchema,
  reviewStatusSchema,
  transactionSchema,
  transactionStatusSchema,
};
