const bcrypt = require("bcrypt");
const User = require("../models/user");
const ctrlWrapper = require("../decorators/ctrlWrapper");
const sendEmail = require("../helpers/Mail");

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
    return res.status(409).json({ message: "Provided email already exists" });
  }

  user.password = await bcrypt.hash(user.password, 10);
  const verificationCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  await User.create({ ...user, verificationCode });

  sendEmail({
    to: "ksenia.cree@gmail.com",
    subject: "TEST MAIL",
    html: `<p>Code: ${verificationCode}</p`,
  });

  return res.status(201).json({ user: { email: user.email } });

  // const payload = { id: userData._id };
  // const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  // await User.findByIdAndUpdate(userData._id, { token });

  // return res.status(201).json({
  //   token,
  //   user: { name: user.name, email: user.email },
  // });
};

const verify = async (req, res, next) => {
  const { verificationCode } = req.body;

  const user = await User.findOne({ verificationCode });

  if (user === null) {
    return res.status(404).json({ message: "User not found" });
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });

  res.json({ message: "Verification successful" });
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

  if (!user.verify) {
    return res.status(403).json({ message: "Email not verify" });
  }

  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(id, { token });

  return res.json({ token, user: { name: user.name, email } });
};

const getCurrent = async (req, res) => {
  const { user } = req;

  res.json({
    email: user.email,
    role: user.role,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName,

    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).end();
};

const updateUserData = async (req, res) => {
  const { user, body } = req;

  const updatedReview = await User.findByIdAndUpdate({ _id: user._id }, body, {
    new: true,
  });

  res.json(updatedReview); // change to other data or text
};

module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUserData: ctrlWrapper(updateUserData),
};
