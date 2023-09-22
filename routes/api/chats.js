const express = require("express");
const router = express.Router();

const { authenticate } = require("../../middlewares");
// const { validateBody } = require("../../middlewares");
// const { messageSchema } = require("../../schemas");

const { chatController } = require("../../controllers");

// const isAdmin = require("../../middlewares/isAdmin");

// router.get("/all", isAdmin, chatController.getAllMessages);


router.post("/addmsg/", chatController.addMessage);
router.post("/getmsg/", chatController.getMessages);

router.use(authenticate);

router.get("/mychat", chatController.getUserMessages);

// router.post("/my", validateBody(messageSchema), chatController.addMessage);



module.exports = router;