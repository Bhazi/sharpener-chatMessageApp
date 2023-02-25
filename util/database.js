const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("chat-application", "root", "mypass", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
