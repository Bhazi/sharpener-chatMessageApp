const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Sample = sequelize.define("sample", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Sample;
