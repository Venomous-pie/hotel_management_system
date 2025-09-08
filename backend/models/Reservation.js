const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Reservation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        numGuest: { type: DataTypes.INTEGER, allowNull: false },
        checkIn: { type: DataTypes.DATE, allowNull: false },
        checkOut: { type: DataTypes.DATE, allowNull: false },
        specialRequest: { type: DataTypes.STRING, allowNull: true },
        status: { type: DataTypes.STRING, allowNull: false },
        totalPrice: { type: DataTypes.FLOAT, allowNull: false },
    })
}