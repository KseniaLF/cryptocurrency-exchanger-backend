const bcrypt = require("bcrypt");
const User = require("../models/user");
const ctrlWrapper = require("../decorators/ctrlWrapper");
const jwt = require("jsonwebtoken");

const {
  HttpError,
  generateTokens,
  getRandomInteger,
  sendVerificationCode,
} = require("../helpers");

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

  await sendVerificationCode(email, verificationCode);

  res.status(201).json({
    user: { email },
    message: "Verify code sent to email",
  });
};

const verify = async (req, res, next) => {
  const { email, verificationCode } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new HttpError(404, "Not found");

  if (user.verify || verificationCode !== Number(user.verificationCode)) {
    throw new HttpError(400, "Code is wrong");
  }

  const { _id: id } = user;
  const { token, refreshToken } = generateTokens(id);

  await User.findByIdAndUpdate(id, {
    token,
    refreshToken,
    verify: true,
    verificationCode: "",
  });

  return res.json({ token, refreshToken, user: { name: user.name, email } });
};

const resendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new HttpError(404, "Not found");

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  const verificationCode = getRandomInteger();
  await User.findByIdAndUpdate(user._id, { verificationCode });

  await sendVerificationCode(email, verificationCode);

  res.json({ message: "Verification email sent" });
};

const passwordReset = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw new HttpError(404, "User not found");

  const verificationCode = getRandomInteger();

  await User.findByIdAndUpdate(user._id, { verificationCode });

  await sendVerificationCode(email, verificationCode);

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
  if (user === null) throw new HttpError(401, "Email or password is wrong");

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch === false) throw new HttpError(401, "Email or password is wrong");

  const { _id: id } = user;
  const { token, refreshToken } = generateTokens(id);

  await User.findByIdAndUpdate(id, { token, refreshToken });

  return res.json({
    token,
    refreshToken,
    user: { name: user.name, email },
  });
};

const refresh = async (req, res, next) => {
  const { refreshToken: refToken } = req.body;
  const { REFRECH_SECRET_KEY } = process.env;

  try {
    const { id } = jwt.verify(refToken, REFRECH_SECRET_KEY);
    const isExist = await User.findOne({ refreshToken: refToken });
    if (!isExist) {
      throw new HttpError(403, "Token invalid");
    }

    const { token, refreshToken } = generateTokens(id);
    await User.findByIdAndUpdate(id, { token, refreshToken });

    res.json({ token, refreshToken });
  } catch (err) {
    throw new HttpError(403, err.message);
  }
};

const getCurrent = async (req, res) => {
  const { user } = req;

  res.json({
    id: user._id,
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

  await User.findByIdAndUpdate(_id, { token: "", refreshToken: "" });

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
  refresh: ctrlWrapper(refresh),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUserData: ctrlWrapper(updateUserData),
  passwordReset: ctrlWrapper(passwordReset),
  verifyPassword: ctrlWrapper(verifyPassword),
};
