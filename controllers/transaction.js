const { HttpError } = require("../helpers");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const Transaction = require("../models/transaction");

const getAllTransactions = async (req, res, next) => {
  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;

  const transaction = await Transaction.find()
    .skip(skip)
    .limit(limit)
    .populate("owner", "email name");

  res.status(200).json(transaction);
};

const addTransaction = async (req, res, next) => {
  const { _id: owner } = req.user;
  const body = req.body;

  const newTransaction = await Transaction.create({ ...body, owner });
  res.status(201).json(newTransaction);
};

const getTransactions = async (req, res, next) => {
  const { _id: owner } = req.user;

  const transaction = await Transaction.find({ owner: owner });
  // .populate("owner", "email name");

  res.status(200).json(transaction);
};

const updateStatusTransaction = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    { _id: id },
    body,
    {
      new: true,
    }
  );

  if (!updatedTransaction) {
    throw new HttpError(404, "Not found");
  }
  res.json(updatedTransaction);
};

module.exports = {
  getAllTransactions: ctrlWrapper(getAllTransactions),
  addTransaction: ctrlWrapper(addTransaction),
  getTransactions: ctrlWrapper(getTransactions),
  updateStatusTransaction: ctrlWrapper(updateStatusTransaction),
};
