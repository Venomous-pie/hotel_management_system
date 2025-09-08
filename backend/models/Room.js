const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Room', {
        id: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
         },
         roomNumber: { type: DataTypes.INTEGER, allowNull: false },
         status: { type: DataTypes.STRING, allowNull: false },
         pricePerNight: { type: DataTypes.FLOAT, allowNull: false },
         floorNumber: { type: DataTypes.INTEGER, allowNull: false }
    })
}