const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const groupName = require("../models/groupName");
const User = require("./user");

const Image = sequelize.define("Image", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  filetype: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  data: {
    type: Sequelize.BLOB("long"),
    allowNull: false,
  },
  sender_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  reciever_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
  },
  group_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: groupName,
      key: "id",
    },
  },
});

module.exports = Image;
