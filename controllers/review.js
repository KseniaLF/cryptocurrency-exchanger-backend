const { HttpError } = require("../helpers");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const Review = require("../models/review");

const getAllReviews = async (req, res, next) => {
  const limit = 2; // Кількість елементів на сторінці
  const cursor = req.query.cursor; // Отримання параметру cursor з запиту

  let query = { status: "pending" }; // Початковий запит для фільтрації за статусом
  if (cursor) {
    query = { status: "pending", _id: { $gt: cursor } }; // Використовуємо _id як курсор
  }

  const items = await Review.find(query)
    .sort("_id")
    .limit(limit)
    .populate("owner", "_id role createdAt email name");

  // Отримання останнього елементу для встановлення нового курсора
  const lastItem = items[items.length - 1];

  res.json({
    items,
    nextCursor: lastItem ? lastItem._id : null, // Встановлення нового курсора
  });
};

const addReview = async (req, res, next) => {
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
  addReview: ctrlWrapper(addReview),
  getReview: ctrlWrapper(getReview),
  removeReview: ctrlWrapper(removeReview),
  updateStatusReview: ctrlWrapper(updateStatusReview),
};
