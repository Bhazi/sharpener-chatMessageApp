const Message = require("../models/messages");
const groupMessage = require("../models/groupMessage");
const groupMembers = require("../models/groupMembers");
const User = require("../models/user");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

exports.postChats = async (req, res) => {
  try {
    if (req.body.for == "personal") {
      const result = await Message.create({
        message: req.body.chats,
        sender_id: req.user,
        receiver_id: req.query.reciever,
      });

      res.status(201).json(result);
    } else {
      const result = await groupMessage.create({
        GroupNameId: req.query.reciever,
        userId: req.user,
        message: req.body.chats,
      });
      res.status(201).json(result);
    }
  } catch (err) {
    res.status(401).json(err);
  }
};

exports.getEverything = async (req, res, next) => {
  await User.findAll().then((e) => {
    res.send({ e, user: req.user });
  });
};

exports.getMessageBwUsers = async (req, res) => {
  function tokenising(id) {
    return jwt.sign({ userId: id }, process.env.TOKEN_SECRET);
  }

  console.log(req.user, "and", req.query.reciever_id);
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          {
            sender_id: req.user,
            receiver_id: req.query.reciever_id,
          },
          {
            sender_id: req.query.reciever_id,
            receiver_id: req.user,
          },
        ],
      },
      include: [
        { model: User, as: "sender" },
        { model: User, as: "receiver" },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json({
      messages,
      user: req.user,
      name: req.names,
      sendUser: tokenising(req.query.reciever_id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.getUsersForCreateGrp = async (req, res) => {
  await User.findAll().then((e) => {
    res.send({ e, user: req.user });
  });
};

exports.getMessageInGrpChat = async (req, res) => {
  console.log(req.user, "this is req.user");
  const attributes = ["message"];
  const attributesInUser = ["username"];
  const result = await groupMessage.findAll({
    where: { GroupNameId: req.query.group_id },
    attributes: attributes,
    include: {
      model: User,
      attributes: ["username", "id"],
    },
  });

  const admin = await groupMembers.findOne({
    where: { user_id: req.user, group_id: req.query.group_id },
    attributes: ["admin"],
  });

  res.status(200).json({
    result,
    sendUser: req.user,
    admin: admin.admin,
  });
};
