require("dotenv").config();

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORDS, {
  dialect: "mysql",
  host: process.env.DB_HOST,
});

module.exports = sequelize;
