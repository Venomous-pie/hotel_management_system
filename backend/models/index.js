const { Sequelize } = require('sequelize');
const GuestsModel = require('./Guest');
const ReservationsModel = require('./Reservation');
const RoomModel = require('./Room');
const RoomTypeModel = require('./RoomType');

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: './system.db'
});

const Guest = GuestsModel(sequelize);
const Reservation = ReservationsModel(sequelize);
const Room = RoomModel(sequelize);
const RoomType = RoomTypeModel(sequelize);

Guest.hasMany(Reservation);

Reservation.belongsTo(Guest);
Reservation.belongsTo(Room);

Room.hasMany(Reservation);
Room.belongsTo(RoomType);

RoomType.hasMany(Room);

module.exports = { sequelize, Guest, Reservation, Room, RoomType };