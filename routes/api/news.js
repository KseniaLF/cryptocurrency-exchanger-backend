const express = require("express");
const router = express.Router();

const { authenticate } = require("../../middlewares");
const { validateBody } = require("../../middlewares");

const { newsSchema } = require("../../schemas");
const { newsController } = require("../../controllers");

router.get("/", newsController.getNews);

router.use(authenticate);

router.post("/", validateBody(newsSchema), newsController.addNews);

router.put("/:id", validateBody(newsSchema), newsController.updateNews);

router.delete("/:id", newsController.deleteNews);

module.exports = router;
