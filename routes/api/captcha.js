const express = require("express");
const router = express.Router();

const { validateBody } = require("../../middlewares");

const { captchaSchema } = require("../../schemas");
const { captchaController } = require("../../controllers");

router.post("/", validateBody(captchaSchema), captchaController.postCaptcha);

module.exports = router;
