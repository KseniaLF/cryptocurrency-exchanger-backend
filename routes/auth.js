const express = require("express");
const router = express.Router();

const { authenticate, validateBody } = require("../middlewares");
const { loginSchema, registerSchema } = require("../schemas");
const { authController } = require("../controllers");

const jsonParser = express.json();

router.post(
  "/register",
  jsonParser,
  validateBody(registerSchema),
  authController.register
);

router.post(
  "/login",
  jsonParser,
  validateBody(loginSchema),
  authController.login
);

router.get("/current", authenticate, authController.getCurrent);

router.get("/logout", authenticate, authController.logout);

module.exports = router;
