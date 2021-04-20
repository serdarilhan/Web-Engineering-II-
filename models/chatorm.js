const { DataTypes } = require(".");
const { sequelize } = require(".");

module.exports = (sequelize,DataTypes) => {
    const chat = sequelize.define("chat",{
        // id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     validate: {
        //         notEmpty: true,
        //     },
        // },
        // Primary Key hinzufügen
        sender: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },    
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });
    return chat;
};


