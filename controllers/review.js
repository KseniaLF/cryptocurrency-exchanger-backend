const { HttpError } = require("../helpers");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const Review = require("../models/review");

const addReview = async (req, res, next) => {
  const { _id: owner } = req.user;
  const body = req.body;

  const updatedReview = await Review.findOneAndUpdate({ owner }, body, {
    new: true,
  }).select("-owner");

  if (!updatedReview) {
    const newReview = await Review.create({ ...body, owner }).select("-owner");
    res.status(201).json(newReview);
  } else {
    res.status(200).json(updatedReview);
  }
};

const getReview = async (req, res, next) => {
  const { _id: owner } = req.user;

  const review = await Review.findOne({ owner: owner });
  // .populate("owner", "email name");

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

module.exports = {
  addReview: ctrlWrapper(addReview),
  getReview: ctrlWrapper(getReview),
  removeReview: ctrlWrapper(removeReview),
};
