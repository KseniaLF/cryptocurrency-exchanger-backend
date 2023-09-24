const { HttpError } = require("../helpers");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const Transaction = require("../models/transaction");

const getAllTransactions = async (req, res, next) => {
  const { cursor, newest } = req.query;
  const { limit = 6 } = req.query; // Кількість елементів на сторінці
  const { status = "pending" } = req.query; // By default status is "pending"

  const query = {}; // return all results
  if (status !== "all") query.status = status; // filtering by status

  if (cursor) {
    query._id = newest ? { $lt: cursor } : { $gt: cursor }; // filtering for less / more than cursor
  }

  const sort = newest ? { _id: -1 } : {};

  const items = await Transaction.find(query)
    .sort(sort)
    .limit(Number(limit) + 1);

  const nextCursor = items[limit] ? items[items.length - 2]._id : null;

  if (items.length > limit) items.pop();

  res.json({
    items,
    nextCursor,
  });
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
