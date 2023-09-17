const bcrypt = require("bcrypt");
const User = require("../models/user");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const getRandomInteger = require("../helpers/getRandomInteger");
const sendVerificationEmail = require("../helpers/verify/sendVerificationEmail");

const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");
const { SECRET_KEY } = process.env;
const EXPIRATION_TIME = "23h";

const register = async (req, res, next) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const email = user.email;

  const currentUser = await User.findOne({ email });
  if (currentUser !== null && currentUser.verify) {
    throw new HttpError(409, "Provided email already exists");
  }
  if (currentUser && !currentUser.verify) {
    throw new HttpError(403, "User needs to complete verification");
  }

  user.password = await bcrypt.hash(user.password, 10);
  const verificationCode = getRandomInteger();

  await User.create({ ...user, verificationCode });

  await sendVerificationEmail(email, verificationCode);

  res.status(201).json({
    user: { email },
    message: "Verify code sent to email",
  });
};

const verify = async (req, res, next) => {
  const { email, verificationCode } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new HttpError(404, "User not found");

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }
  if (verificationCode !== Number(user.verificationCode)) {
    throw new HttpError(400, "Verification code is wrong");
  }

  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION_TIME });

  await User.findByIdAndUpdate(id, {
    token,
    verify: true,
    verificationCode: "",
  });

  return res.json({ token, user: { name: user.name, email } });
};

const resendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new HttpError(404, "User not found");

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  const verificationCode = getRandomInteger();
  await User.findByIdAndUpdate(user._id, { verificationCode });

  await sendVerificationEmail(email, verificationCode);

  res.json({ message: "Verification email sent" });
};

const passwordReset = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw new HttpError(404, "User not found");

  const verificationCode = getRandomInteger();

  await User.findByIdAndUpdate(user._id, { verificationCode });

  await sendVerificationEmail(email, verificationCode);

  res.status(200).json({ email, message: "Verify code sent to email" });
};

const verifyPassword = async (req, res, next) => {
  const { email, verificationCode } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new HttpError(404, "User not found");

  if (verificationCode !== Number(user.verificationCode)) {
    throw new HttpError(400, "Verification code is wrong");
  }

  const password = await bcrypt.hash(req.body.password, 10);

  await User.findByIdAndUpdate(user._id, { password, verificationCode: "" });

  res.status(200).json({ message: "Password successfully changed" });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && !user.verify) {
    throw new HttpError(403, "Email not verified");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (user === null || isMatch === false) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION_TIME });

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
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUserData: ctrlWrapper(updateUserData),
  passwordReset: ctrlWrapper(passwordReset),
  verifyPassword: ctrlWrapper(verifyPassword),
};
