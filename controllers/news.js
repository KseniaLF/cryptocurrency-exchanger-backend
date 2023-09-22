// const { HttpError } = require("../helpers");
const ctrlWrapper = require("../decorators/ctrlWrapper");
const News = require("../models/news");

const addNews = async (req, res, next) => {
  const { _id: owner } = req.user;
  const body = req.body;

  const newTransaction = await News.create({ ...body, owner });

  res.status(201).json(newTransaction);
};

const getNews = async (req, res, next) => {
  const allNews = await News.find().populate("owner", "name");

  res.json(allNews);
};

module.exports = {
  addNews: ctrlWrapper(addNews),
  getNews: ctrlWrapper(getNews),
};
