const Chat = require("../models/chats");
const User = require("../models/user");
const { Op } = require("sequelize");

exports.getUserName = async (req, res) => {
  var messageCount = parseInt(req.query.messageCount);
  console.log(messageCount);
  var attributes = ["messages"];
  const message = await Chat.findAll({
    where: {
      id: { [Op.lt]: messageCount },
    },
    include: {
      model: User,
      attributes: ["name"],
    },
    attributes: attributes,
    // order: [['createdAt', 'DESC']]
  });

  res.status(200).json({ messages: message });
};

// name: req.names, messages: message

exports.postChats = async (req, res) => {
  try {
    const result = await Chat.create({
      messages: req.body.chats,
      userId: req.user,
    });
    res.status(201).json({
      message: req.body.chats,
      name: req.names,
      id: result.userId,
      msgId: result.id,
    });
  } catch (err) {
    res.status(401).json();
  }
};
