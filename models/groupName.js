const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const GroupName = sequelize.define("GroupName", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = GroupName;
