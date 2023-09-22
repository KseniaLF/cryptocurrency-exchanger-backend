const ctrlWrapper = require("../decorators/ctrlWrapper");
const News = require("../models/news");

const addNews = async (req, res, next) => {
  const { _id: owner } = req.user;
  const body = req.body;

  const newTransaction = await News.create({ ...body, owner });

  res.status(201).json(newTransaction);
};

const updateNews = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  const updatedNews = await News.findByIdAndUpdate(id, body, { new: true });

  res.status(200).json(updatedNews);
};

const getNews = async (req, res, next) => {
  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;

  const totalNews = await News.countDocuments({});

  const news = await News.find()
    .skip(skip)
    .limit(limit)
    .populate("owner", "name");

  res.json({
    news,
    currentPage: Number(page),
    totalPages: Math.ceil(totalNews / limit),
  });
};

const deleteNews = async (req, res, next) => {
  await News.findByIdAndRemove(req.params.id);
  res.status(204).end();
};

module.exports = {
  addNews: ctrlWrapper(addNews),
  getNews: ctrlWrapper(getNews),
  updateNews: ctrlWrapper(updateNews),
  deleteNews: ctrlWrapper(deleteNews),
};
