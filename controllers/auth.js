const bcrypt = require("bcrypt");
const User = require("../models/user");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const getRandomInteger = require("../helpers/getRandomInteger");
const sendVerificationEmail = require("../helpers/verify/sendVerificationEmail");

const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");
const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const currentUser = await User.findOne({ email: user.email });
  if (currentUser !== null) {
    throw new HttpError(409, "Provided email already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);
  const verificationCode = getRandomInteger();

  await User.create({ ...user, verificationCode });

  const emailResult = await sendVerificationEmail(user.email, verificationCode);

  if (emailResult.success) {
    res.status(201).json({
      user: { email: user.email },
      message: "Verify code sent to email",
    });
  } else {
    throw new Error("Email sending failed");
  }
};

const verify = async (req, res, next) => {
  const { email, verificationCode } = req.body;

  const user = await User.findOne({ email, verificationCode });

  if (!user) throw new HttpError(404, "Not found");

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });

  res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new HttpError(404, "User not found");

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  const emailResult = await sendVerificationEmail(email, user.verificationCode);

  if (emailResult.success) {
    res.json({ message: "Verification email sent" });
  } else {
    throw new Error("Email sending failed");
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user === null) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch === false) {
    throw new HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw new HttpError(403, "Email not verify");
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
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUserData: ctrlWrapper(updateUserData),
};
