const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Chats = sequelize.define("chats", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  messages: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Chats;
