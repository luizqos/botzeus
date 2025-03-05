const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Renew = sequelize.define("Renew", {
    uuid: {
        type: DataTypes.STRING,
        allowNull: true,
        primaryKey: true,
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: "renew",
    timestamps: false,
});

module.exports = Renew;
