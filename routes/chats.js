const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chat");
const authentication = require("../middleware/Authentication");

// router.get("/messageInterface",chatController.getchatInterface);

router.get(
  "/message",
  authentication.getVerifyingIdFromToken,
  chatController.getUserName
);

router.post(
  "/chats",
  authentication.getVerifyingIdFromToken,
  chatController.postChats
);

module.exports = router;
