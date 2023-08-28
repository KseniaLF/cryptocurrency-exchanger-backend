const express = require("express");
const router = express.Router();

const { authenticate, validateBody } = require("../../middlewares");

const { transactionSchema } = require("../../schemas");
const { transactionController } = require("../../controllers");
// const isAdmin = require("../../middlewares/isAdmin");

router.use(authenticate);

router.get("/", transactionController.getTransactions);

router.post(
  "/",
  validateBody(transactionSchema),
  transactionController.addTransaction
);

module.exports = router;
