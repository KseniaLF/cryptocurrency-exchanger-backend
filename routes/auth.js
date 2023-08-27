const express = require("express");
const router = express.Router();

const { authenticate, validateBody } = require("../middlewares");
const { authSchema } = require("../schemas");
const { authController } = require("../controllers");

const jsonParser = express.json();

router.post(
  "/register",
  jsonParser,
  validateBody(authSchema),
  authController.register
);

router.post(
  "/login",
  jsonParser,
  validateBody(authSchema),
  authController.login
);

router.get("/current", authenticate, authController.getCurrent);

router.get("/logout", authenticate, authController.logout);

module.exports = router;
