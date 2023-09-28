const express = require("express");
const router = express.Router();

const { authenticate } = require("../../middlewares");
const { validateBody } = require("../../middlewares");

const { newsSchema } = require("../../schemas");
const { newsController } = require("../../controllers");
const isAdmin = require("../../middlewares/isAdmin");

router.get("/", newsController.getNews);

router.use(authenticate);

router.post("/", isAdmin, validateBody(newsSchema), newsController.addNews);

router.put(
  "/:id",
  isAdmin,
  validateBody(newsSchema),
  newsController.updateNews
);

router.delete("/:id", isAdmin, newsController.deleteNews);

module.exports = router;
