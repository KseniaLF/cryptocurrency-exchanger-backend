const { HttpError } = require("../helpers");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const Review = require("../models/review");

const getApprovedReviews = async (req, res, next) => {
  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;

  const review = await Review.find()
    .skip(skip)
    .limit(limit)
    .populate("owner", "_id role createdAt email name");

  res.status(200).json(review);
};

const getAllReviews = async (req, res, next) => {
  console.log("HI");
  const { cursor } = req.query;
  const { limit = 2 } = req.query; // Кількість елементів на сторінці
  const { status = "pending" } = req.query; // By default status is "pending"

  let query = { status }; // Initial request for filtering by status
  if (status === "all") query = {}; // return all results

  console.log(query);
  if (cursor) {
    query = { ...query, _id: { $gt: cursor } };
  }

  const items = await Review.find(query)
    .sort("_id")
    .limit(limit)
    .populate("owner", "_id role createdAt email name");

  // Отримання останнього елементу для встановлення нового курсора
  const lastItem = items[items.length - 1];

  const nextCursor = lastItem ? lastItem._id : null;

  const nextPageItems = await Review.find({
    ...query,
    _id: { $gt: nextCursor },
  }).limit(1);

  res.json({
    items,
    nextCursor, // Встановлення нового курсора
    hasMore: nextPageItems.length > 0,
  });
};

const addReview = async (req, res, next) => {
  console.log(req.user);
  const { _id: owner } = req.user;
  const body = req.body;

  const updatedReview = await Review.findOneAndUpdate({ owner }, body, {
    new: true,
  }).select("-owner");

  if (!updatedReview) {
    const newReview = await Review.create({ ...body, owner });
    res.status(201).json(newReview);
  } else {
    res.status(200).json(updatedReview);
  }
};

const getReview = async (req, res, next) => {
  const { _id: owner } = req.user;

  const review = await Review.findOne({ owner: owner });

  res.status(200).json(review);
};

const removeReview = async (req, res, next) => {
  const { _id: owner } = req.user;

  const deletedReview = await Review.findOneAndDelete({
    owner,
  });

  if (!deletedReview) {
    throw new HttpError(404, "Not found");
  }
  res.json({ message: "Your review is deleted" });
};

const updateStatusReview = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  const updatedReview = await Review.findByIdAndUpdate({ _id: id }, body, {
    new: true,
  });

  if (!updatedReview) {
    throw new HttpError(404, "Not found");
  }
  res.json(updatedReview);
};

module.exports = {
  getAllReviews: ctrlWrapper(getAllReviews),
  getApprovedReviews: ctrlWrapper(getApprovedReviews),

  addReview: ctrlWrapper(addReview),
  getReview: ctrlWrapper(getReview),
  removeReview: ctrlWrapper(removeReview),
  updateStatusReview: ctrlWrapper(updateStatusReview),
};
