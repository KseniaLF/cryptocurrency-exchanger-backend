const express = require("express");
const router = express.Router();

const { tickerController } = require("../../controllers");

router.get("/", tickerController.getTicker);

module.exports = router;
