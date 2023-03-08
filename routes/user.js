const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");
const authentication = require("../middleware/Authentication");

router.post("/signup", userController.postSignUp);

router.post("/login", userController.postLogIn);

router.post(
  "/relationship",
  authentication.getVerifyingIdFromToken,
  userController.postRelationship // 8
);

router.get(
  "/relationshipInScreen",
  authentication.getVerifyingIdFromToken,
  userController.getUsersInScreen // 2
);

router.post(
  "/createGrpUsers",
  authentication.getVerifyingIdFromToken,
  userController.createGrpUsers // 6
);

module.exports = router;
