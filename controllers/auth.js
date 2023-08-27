const bcrypt = require("bcrypt");
const User = require("../models/user");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const currentUser = await User.findOne({ email: user.email });
  if (currentUser !== null) {
    return res.status(409).json({ message: "Email in use" });
  }

  user.password = await bcrypt.hash(user.password, 10);

  const userData = await User.create(user);

  const payload = { id: userData._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(userData._id, { token });

  return res.status(201).json({
    token,
    user: { name: user.name, email: user.email },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user === null) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch === false) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(id, { token });

  return res.json({ token, user: { name: user.name, email } });
};

const getCurrent = async (req, res) => {
  const { name, email } = req.user;

  res.json({ name, email });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).end();
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
};
