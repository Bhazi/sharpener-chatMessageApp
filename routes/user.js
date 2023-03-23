const express = require("express");
const multer = require("multer");
const uuid = require("uuid").v4;
const Image = require("../models/images");
const fs = require("fs");

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

router.get(
  "/groupMembers",
  authentication.getVerifyingIdFromToken,
  userController.getMembersInGrp
);

router.put("/makeAdmin", userController.postMakeAdmin);

router.delete("/:userId/:groupId", userController.deleteMember);

router.get("/searching", userController.getSearchUser);

router.put("/addMemberForGrp", userController.postAddMemberForGrp);

const upload = multer({ storage: multer.memoryStorage() });
router.post(
  "/addDocuments",
  authentication.getVerifyingIdFromToken,
  upload.single("file"),
  userController.postDocuments
);

router.post(
  "/addImages",
  authentication.getVerifyingIdFromToken,
  upload.single("file"),
  userController.postImages
);

//////sample
// const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })
// const upload = multer({ storage: storage })

// const multiUpload = upload.fields([
//   { name: "avatar", maxCount: 1 },
//   { name: "poli", maxCount: 6 },
// ]);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     const { originalname } = file;
//     cb(null, `${uuid()}-${originalname}`);
//   },
// });
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// router.post("/poioi", upload.array("file"), function (req, res, next) {
//   const file = req.files[0];
//   const { originalname, mimetype, buffer } = file;
//   console.log(originalname, mimetype, buffer);
//   const image = {
//     filename: originalname,
//     filetype: mimetype,
//     data: buffer,
//   };
//   Image.create(image)
//     .then(() => {
//       res.send("Image uploaded successfully");
//     })
//     .catch((error) => {
//       console.log(error);
//       res.send("Error uploading image");
//     });
// });

// router.post("/poioi", upload.single("file"), function (req, res, next) {
//   const { originalname, mimetype, buffer } = req.file;
//   console.log(originalname, mimetype, buffer);
//   const image = {
//     filename: originalname,
//     filetype: mimetype,
//     data: buffer,
//   };
//   Image.create(image)
//     .then(() => {
//       res.send("Image uploaded successfully");
//     })
//     .catch((error) => {
//       console.log(error);
//       res.send("Error uploading image");
//     });
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     const { originalname } = file;
//     cb(null, `${uuid()}-${originalname}`);
//   },
// });

// const upload = multer({ storage });

router.post("/poioi", upload.single("file"), async (req, res, next) => {
  const { originalname, mimetype, buffer } = req.file;
  // const filePath = req.file.path;
  console.log(req.file);
  try {
    // Read file content from disk
    // const fileContent = await fs.promises.readFile(filePath);

    // Convert file content to buffer
    // const buffer = Buffer.from(fileContent);

    // Create image object with buffer
    const image = {
      filename: originalname,
      filetype: mimetype,
      data: buffer,
    };

    // Save image to database
    await Image.create(image);

    res.send("Image uploaded successfully");
  } catch (error) {
    console.log(error);
    res.send("Error uploading image");
  }
});

router.get("/popo", async (req, res) => {
  await Image.findAll()
    .then((images) => {
      res.json(images);
    })
    .catch((error) => {
      console.log(error);
      res.send("Error retrieving images");
    });
});

// // const multer = require("multer");
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// router.post("/aaaww", upload.single("file"), async (req, res) => {
//   try {
//     const { originalname, buffer, mimetype } = req.file;
//     // Create image object with buffer
//     const image = {
//       filename: originalname,
//       filetype: mimetype,
//       data: buffer,
//     };

//     // Save image to database
//     await Image.create(image);
//     res.send("Image uploaded successfully");
//   } catch (error) {
//     console.log(error);
//     res.send("Error uploading image");
//   }
// });
module.exports = router;
