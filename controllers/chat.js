const Chat = require("../models/chats");
const User = require("../models/user");

exports.getUserName = async (req, res) => {
  var attributes = ["messages"];
  const message = await Chat.findAll({
    include: {
      model: User,
      attributes: ["name"],
    },
    attributes: attributes,
  });

  res.status(200).json({ messages: message });
};

// name: req.names, messages: message

exports.postChats = async (req, res) => {
  await Chat.create({
    messages: req.body.chats,
    userId: req.user,
  })
    .then(res.status(201).json())
    .catch(res.status(401).json());
};
