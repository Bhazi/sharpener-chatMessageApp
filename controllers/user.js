const User = require("../models/user");
const groupName = require("../models/groupName");
const groupMembers = require("../models/groupMembers");
const UserRelationship = require("../models/userRelationship");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const GroupName = require("../models/groupName");
const { where } = require("sequelize");
const Sample = require("../models/sample");
const Documents = require("../models/documents");
const Images = require("../models/images");

exports.postSignUp = (req, res, next) => {
  var { name, email, phone, password } = req.body;

  try {
    if (name == "" || email == "" || phone == "" || password == "") {
      return res.status(400).json();
    }

    bcrypt.hash(password, 10, async (req, hash) => {
      await User.create({
        username: name,
        email: email,
        phoneNo: phone,
        password: hash,
      })
        .then((data) => {
          res.status(201).json();
        })
        .catch((err) => {
          console.log("already exist the mail");
          res.status(401).json();
        });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json();
  }
};

exports.postLogIn = async (req, res, next) => {
  var { email, password } = req.body;

  console.log(email, password);

  //checking email exist or not in database
  const emailsIsThereOrNot = await User.findOne({ where: { email: email } });
  if (emailsIsThereOrNot == null) {
    return res.status(404).json();
  }

  //finding password belongs to the email
  var attributes = ["password", "id", "username"];
  const passwordFromDb = await User.findOne({
    where: { email: email },
    attributes: attributes,
  });

  var obj = JSON.stringify(passwordFromDb);
  obj = JSON.parse(obj);

  //tokenising the ID
  function tokenising(id, name) {
    return jwt.sign({ userId: id, names: name }, process.env.TOKEN_SECRET);
  }

  bcrypt.compare(password, obj.password, (err, result) => {
    if (result) {
      res.status(200).json({
        message: "User login sucessful",
        token: tokenising(obj.id, obj.username),
      });
    } else {
      res.status(401).json();
    }
  });
};

exports.postRelationship = async (req, res) => {
  try {
    await UserRelationship.create({
      user_id: req.user,
      follower_id: req.body.relatedFriendId,
    });
    await UserRelationship.create({
      user_id: req.body.relatedFriendId,
      follower_id: req.user,
    });

    res.sendStatus(201); // Created
  } catch (err) {
    console.log(err);
    res.sendStatus(409); // Conflict
  }
};

exports.getUsersInScreen = async (req, res) => {
  try {
    const attributes = ["username", "id"];
    const result = await UserRelationship.findAll({
      where: { user_id: req.user },
      include: [
        {
          model: User,
          as: "user",
          attributes: attributes,
        },
      ],
    });

    const attribute = ["group_id"];
    const userGroups = await groupMembers.findAll({
      where: {
        user_id: req.user,
      },
      attributes: attribute,
    });

    const attributea = ["name", "id"];
    let wwwww = await Promise.all(
      userGroups.map(async (groupIds) => {
        return GroupName.findOne({
          where: { id: groupIds.group_id },
          attributes: attributea,
        });
      })
    );

    res.status(200).json({ result: result, re: wwwww });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

exports.createGrpUsers = async (req, res) => {
  const groupId = await groupName.create({
    name: req.body.groupName,
  });

  if (req.body.array != null) {
    try {
      await Promise.all(
        req.body.array.map(async (element) => {
          await groupMembers.create({
            user_id: element,
            group_id: groupId.id,
          });
        })
      );

      // Add the creator to the group as well
      await groupMembers.create({
        user_id: req.user,
        group_id: groupId.id,
        admin: true,
      });

      res.status(200).send("Group created successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error creating group members");
    }
  } else {
    res.status(400).send("No group members provided");
  }
};

exports.getMembersInGrp = async (req, res) => {
  const attributes = ["user_id", "admin"];
  const result = await groupMembers.findAll({
    where: { group_id: req.query.groupiId },
    attributes: attributes,
    include: {
      model: User,
      as: "users",
      attributes: ["username", "id"],
    },
  });

  res.status(200).json({
    users: result,
    sendUser: req.user,
  });
};

exports.postMakeAdmin = async (req, res) => {
  try {
    const { userId, groupId } = req.query;
    const result = await groupMembers.update(
      { admin: true },
      {
        where: {
          user_id: userId,
          group_id: groupId,
        },
      }
    );
    res.status(200).json({ success: "success" });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteMember = async (req, res) => {
  try {
    await groupMembers.destroy({
      where: { user_id: req.params.userId, group_id: req.params.groupId },
    });
    res.send({ message: "successfully deleted", success: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting member from group");
  }
};

exports.getSearchUser = async (req, res) => {
  console.log(req.query.searchType, "the type");
  console.log(req.query.value, "the value");

  try {
    let user;
    if (req.query.searchType == "name") {
      user = await User.findAll({ where: { username: req.query.value } });
    } else if (req.query.searchType == "phone") {
      user = await User.findAll({ where: { phoneNo: req.query.value } });
    } else {
      user = await User.findAll({ where: { email: req.query.value } });
    }

    res.json({ user, success: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.postAddMemberForGrp = async (req, res) => {
  console.log(req.query);
  await groupMembers.create({
    user_id: req.query.userId,
    group_id: req.query.groupId,
  });
};

exports.samplePost = async (req, res) => {
  await Sample.create({ username: req.body.name }).then((result) => {
    res.send(result);
  });
};

exports.getSamples = async (req, res) => {
  await Sample.findAll().then((result) => {
    res.send(result);
  });
};

exports.poioiPost = async (req, res) => {
  // console.log(req.files);
  console.log(req.files[0].buffer);
  // const { originalname, mimetype } = req.files;
  // const originalname = req.file.originalname;
  // console.log(originalname, mimetype);

  // const image = {
  //   filename: originalname,
  //   filetype: mimetype,
  //   data: buffer,
  // };
  // Image.create(image)
  //   .then(() => {
  //     res.send("Image uploaded successfully");
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     res.send("Error uploading image");
  //   });
  // res.send("file uploaded successfully");
};

exports.postDocuments = async (req, res) => {
  const { originalname, mimetype, buffer } = req.file;

  try {
    if (req.query.forChat == "personal") {
      await Documents.create({
        filename: originalname,
        filetype: mimetype,
        data: buffer,
        sender_id: req.user,
        reciever_id: req.query.token2,
      });
    } else {
      await Documents.create({
        filename: originalname,
        filetype: mimetype,
        data: buffer,
        sender_id: req.user,
        group_id: req.query.token2,
      });
    }

    res.status(201).json({ message: "Document uploaded successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.postImages = async (req, res) => {
  const { originalname, mimetype, buffer } = req.file;

  try {
    if (req.query.forChat == "personal") {
      await Images.create({
        filename: originalname,
        filetype: mimetype,
        data: buffer,
        sender_id: req.user,
        reciever_id: req.query.token2,
      });
    } else {
      await Images.create({
        filename: originalname,
        filetype: mimetype,
        data: buffer,
        sender_id: req.user,
        group_id: req.query.token2,
      });
    }
    res.status(201).json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.log(error);
  }
};
