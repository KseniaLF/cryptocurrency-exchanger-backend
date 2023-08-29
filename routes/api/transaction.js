const express = require("express");
const router = express.Router();

const { authenticate } = require("../../middlewares");
const { validateBody } = require("../../middlewares");

const { transactionSchema, transactionStatusSchema } = require("../../schemas");
const { transactionController } = require("../../controllers");
const isAdmin = require("../../middlewares/isAdmin");

router.use(authenticate);

router.get("/", isAdmin, transactionController.getAllTransactions);

router.get("/my", transactionController.getTransactions);

router.post(
  "/",
  validateBody(transactionSchema),
  transactionController.addTransaction
);

router.patch(
  "/:id",
  isAdmin,
  validateBody(transactionStatusSchema),
  transactionController.updateStatusTransaction
);

module.exports = router;
