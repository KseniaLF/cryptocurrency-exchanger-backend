const { HttpError } = require("../helpers");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const Transaction = require("../models/transaction");

const addTransaction = async (req, res, next) => {
  const { _id: owner } = req.user;
  const body = req.body;

  const newTransaction = await Transaction.create({ ...body, owner });
  res.status(201).json(newTransaction);
};

const getTransactions = async (req, res, next) => {
  const { _id: owner } = req.user;

  const transactions = await Transaction.find({ owner: owner });

  if (!transactions) {
    throw new HttpError(404, "No transactions yet");
  }
  res.status(200).json(transactions);
};

module.exports = {
  addTransaction: ctrlWrapper(addTransaction),
  getTransactions: ctrlWrapper(getTransactions),
};
