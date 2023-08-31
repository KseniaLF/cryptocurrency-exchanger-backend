const express = require("express");
const router = express.Router();

// const { authenticate } = require("../../middlewares");
const { validateBody } = require("../../middlewares");

const { reviewSchema, reviewStatusSchema } = require("../../schemas");
const { reviewController } = require("../../controllers");
// const isAdmin = require("../../middlewares/isAdmin");

router.get("/", reviewController.getAllReviews);

// router.use(authenticate);

router.get("/my", reviewController.getReview);

router.post("/my", validateBody(reviewSchema), reviewController.addReview);

router.delete("/my", reviewController.removeReview);

router.patch(
  "/:id",
  // isAdmin,
  validateBody(reviewStatusSchema),
  reviewController.updateStatusReview
);

module.exports = router;
