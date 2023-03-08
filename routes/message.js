const express = require("express");

const router = express.Router();

const chatController = require("../controllers/message");
const authentication = require("../middleware/Authentication");

// router.get("/messageInterface",chatController.getchatInterface);


router.post(
  "/chats",
  authentication.getVerifyingIdFromToken,
  chatController.postChats // 1
);

router.get(
  "/hello",
  authentication.getVerifyingIdFromToken,
  chatController.getEverything // 7
);

router.get(
  "/messageChat",
  authentication.getVerifyingIdFromToken,
  chatController.getMessageBwUsers  //4
);

router.get(
  "/groupChatMessage",
  authentication.getVerifyingIdFromToken,
  chatController.getMessageInGrpChat //3
);

router.get(
  "/createGrpUsers",
  authentication.getVerifyingIdFromToken,
  chatController.getUsersForCreateGrp // 5
);

module.exports = router;
