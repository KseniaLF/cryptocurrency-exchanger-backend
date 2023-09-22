const ctrlWrapper = require("../decorators/ctrlWrapper");

const Message = require("../models/message");
const User = require("../models/user");

const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map(msg => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

const getAllUsers = async (req, res, next) => {
  const { limit = 10 } = req.query;

  const items = await User.find().sort("_id").limit(limit);

  // .populate("message", "_id status createdAt users");

  res.json({
    items,
  });
};

const getUserMessages = async (req, res, next) => {
  const { _id: owner } = req.user;

  const messages = await Message.find({ owner: owner });

  res.status(200).json(messages);
};

module.exports = {
  getAllUsers: ctrlWrapper(getAllUsers),
  getUserMessages: ctrlWrapper(getUserMessages),
  getMessages: ctrlWrapper(getMessages),
  addMessage: ctrlWrapper(addMessage),
};
