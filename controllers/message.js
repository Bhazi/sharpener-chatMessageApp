const Message = require("../models/messages");
const groupMessage = require("../models/groupMessage");
const groupMembers = require("../models/groupMembers");
const User = require("../models/user");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const Images = require("../models/images");
const Documents = require("../models/documents");

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

    const imageResult = await Images.findAll({
      where: {
        [Op.or]: [
          {
            sender_id: req.user,
            reciever_id: req.query.reciever_id,
          },
          {
            sender_id: req.query.reciever_id,
            reciever_id: req.user,
          },
        ],
      },
      include: {
        as: "sender",
        model: User,
        attributes: ["username", "id"],
      },
    });

    const documentResult = await Documents.findAll({
      where: {
        [Op.or]: [
          {
            sender_id: req.user,
            reciever_id: req.query.reciever_id,
          },
          {
            sender_id: req.query.reciever_id,
            reciever_id: req.user,
          },
        ],
      },
      include: {
        as: "sender",
        model: User,
        attributes: ["username", "id"],
      },
    });

    const data = [
      ...messages.map((messages) => ({
        type: "message",
        message: messages,
        createdAt: messages.createdAt,
      })),
      ...imageResult.map((image) => ({
        type: "image",
        data: image,
        createdAt: image.createdAt,
      })),
      ...documentResult.map((document) => ({
        type: "document",
        data: document,
        createdAt: document.createdAt,
      })),
    ];

    // Sort the data array by the createdAt timestamp
    data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    ///////
    // const data = [
    //   ...result.map((message) => ({
    //     type: "message",
    //     message: message.message,
    //     createdAt: message.createdAt,
    //     user: message.user,
    //   })),
    //   ...imageResult.map((image) => ({
    //     type: "image",
    //     data: image,
    //     createdAt: image.createdAt,
    //   })),
    //   ...documentResult.map((document) => ({
    //     type: "document",
    //     data: document,
    //     createdAt: document.createdAt,
    //   })),
    // ];
    /////
    // res.status(200).json({
    //   imageResult,
    //   messages,
    //   user: req.user,
    //   name: req.names,
    //   sendUser: tokenising(req.query.reciever_id),
    // });
    res.status(200).json({
      data,
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

// exports.getMessageInGrpChat = async (req, res) => {
//   console.log(req.user, "this is req.user");
//   const attributes = ["message","createdAt"];
//   const result = await groupMessage.findAll({
//     where: { GroupNameId: req.query.group_id },
//     attributes: attributes,
//     include: {
//       model: User,
//       attributes: ["username", "id"],
//     },
//   });

//   const data = [];
//   // result.forEach(())

//   const imageResult = await Images.findAll({
//     where: { group_id: req.query.group_id },
//   });

//   const admin = await groupMembers.findOne({
//     where: { user_id: req.user, group_id: req.query.group_id },
//     attributes: ["admin"],
//   });

//   res.status(200).json({
//     result,
//     sendUser: req.user,
//     admin: admin,
//     imageResult: imageResult,
//   });
// };

//////////////////////////
exports.getMessageInGrpChat = async (req, res) => {
  console.log(req.user, "this is req.user");
  const messageAttributes = ["message", "createdAt"];
  const result = await groupMessage.findAll({
    where: { GroupNameId: req.query.group_id },
    attributes: messageAttributes,
    include: {
      model: User,
      attributes: ["username", "id"],
    },
  });

  const imageResult = await Images.findAll({
    where: { group_id: req.query.group_id },
    include: {
      as: "sender",
      model: User,
      attributes: ["username", "id"],
    },
  });

  const documentResult = await Documents.findAll({
    where: { group_id: req.query.group_id },
    include: {
      as: "sender",
      model: User,
      attributes: ["username", "id"],
    },
  });

  // Merge the messages and images into a single array
  // const data = [...result, ...imageResult, ...documentResult];

  ///////////////////

  const data = [
    ...result.map((message) => ({
      type: "message",
      message: message.message,
      createdAt: message.createdAt,
      user: message.user,
    })),
    ...imageResult.map((image) => ({
      type: "image",
      data: image,
      createdAt: image.createdAt,
    })),
    ...documentResult.map((document) => ({
      type: "document",
      data: document,
      createdAt: document.createdAt,
    })),
  ];
  /////////
  // Sort the data array by the createdAt timestamp
  data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const admin = await groupMembers.findOne({
    where: { user_id: req.user, group_id: req.query.group_id },
    attributes: ["admin"],
  });

  res.status(200).json({
    data,
    sendUser: req.user,
    admin: admin,
  });
};
