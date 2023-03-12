const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User = require("./user");
const GroupName = require("./groupName");

const GroupMembers = sequelize.define("GroupMembers", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  group_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: GroupName,
      key: "id",
    },
  },
  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
});

module.exports = GroupMembers;
