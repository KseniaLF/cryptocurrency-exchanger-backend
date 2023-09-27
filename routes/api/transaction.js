const express = require("express");
const router = express.Router();

const { authenticate } = require("../../middlewares");
const { validateBody } = require("../../middlewares");

const { transactionSchema, transactionStatusSchema } = require("../../schemas");
const { transactionController } = require("../../controllers");
const isAdmin = require("../../middlewares/isAdmin");

router.get("/", isAdmin, transactionController.getAllTransactions);

router.patch(
  "/:id",
  isAdmin,
  validateBody(transactionStatusSchema),
  transactionController.updateStatusTransaction
);

router.use(authenticate);

router.get("/my", transactionController.getTransactions);

router.post(
  "/my",
  validateBody(transactionSchema),
  transactionController.addTransaction
);

module.exports = router;
