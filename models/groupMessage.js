const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const GroupName = require("./groupName");

const GroupMessage = sequelize.define("GroupMessage", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = GroupMessage;
