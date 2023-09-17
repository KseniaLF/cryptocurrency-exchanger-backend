const express = require("express");
const router = express.Router();

const { authenticate, validateBody } = require("../middlewares");
const {
  loginSchema,
  registerSchema,
  verifySchema,
  resendVerifySchema,
  passwordResetSchema,
} = require("../schemas");
const { authController } = require("../controllers");

const jsonParser = express.json();

router.post(
  "/register",
  jsonParser,
  validateBody(registerSchema),
  authController.register
);

router.post(
  "/verify",
  jsonParser,
  validateBody(verifySchema),
  authController.verify
);

router.post(
  "/resendVerifyEmail",
  jsonParser,
  validateBody(resendVerifySchema),
  authController.resendVerifyEmail
);

router.post(
  "/login",
  jsonParser,
  validateBody(loginSchema),
  authController.login
);

router.get("/current", authenticate, authController.getCurrent);

router.get("/logout", authenticate, authController.logout);

router.patch("/updateData", authenticate, authController.updateUserData);

router.post(
  "/passwordReset",
  jsonParser,
  validateBody(resendVerifySchema),
  authController.passwordReset
);

router.post(
  "/verifyPassword",
  jsonParser,
  validateBody(passwordResetSchema),
  authController.verifyPassword
);

module.exports = router;
