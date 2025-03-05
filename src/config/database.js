const { Sequelize } = require("sequelize");
require("dotenv").config();

const config = {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    dialect: "mysql",
    port: process.env.DB_PORT,
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

module.exports = sequelize;
