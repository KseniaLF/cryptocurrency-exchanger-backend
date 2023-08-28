const authSchema = require("./auth");
const reviewSchema = require("./review");
const reviewStatusSchema = require("./reviewStatus");
const transactionSchema = require("./transaction");
const transactionStatusSchema = require("./transactionStatus");

module.exports = {
  authSchema,
  reviewSchema,
  reviewStatusSchema,
  transactionSchema,
  transactionStatusSchema,
};
