const express = require("express");
const router = express.Router();

const { authenticate } = require("../../middlewares");
const { validateBody } = require("../../middlewares");

const { reviewSchema } = require("../../schemas");
const { reviewController } = require("../../controllers");

router.use(authenticate);

router.get("/", reviewController.getReview);

router.post("/", validateBody(reviewSchema), reviewController.addReview);

router.delete("/", reviewController.removeReview);

module.exports = router;
