const express = require('express');
const cors = require('cors');
const { sequelize, Guest, Reservation, Room, RoomType } = require('./models');

const app = express();
const PORT = undefined || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('DB is correct lol.')
})

// Reservation routes
app.post('/api/reserve-room', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { firstName, middleName, lastName,
            email, phone, address, idDocument,
            numGuest, checkIn, checkOut, specialRequest,
            status, totalPrice, roomNumber, roomId } = req.body;

        if (!firstName || !middleName || !lastName ||
            !email || !phone || !address || !idDocument ||
            !numGuest || !checkIn || !checkOut || !status ||
            !totalPrice || !roomNumber) {
            return res.status(400).json({ error: "All fields are required." })
        }

        const [guest] = await Guest.findOrCreate({
            where: { idDocument, email },
            defaults: {
                phone,
                email,
                firstName,
                middleName,
                lastName,
                address
            }
        })

        const room = await Room.findByPk(roomId);

        if (!room) {
            return res.status(404).json({ error: `Room with ID: ${roomId} doesn't exist.` });
        }

        const reservation = await Reservation.create({
            numGuest, checkIn, checkOut, specialRequest,
            status, totalPrice, roomNumber, RoomId: room.id,
            GuestId: guest.id
        }, { transaction: t });

        await t.commit();

        res.status(201).json({ reservation })
    } catch (error) {
        await t.rollback();
        return res.status(500).json({ error: `Error message: ${error}` })
    }
});

app.get('/api/reservations', async (req, res) => {
    try {
        const reservation = await Reservation.findAll();
        return res.json(reservation);
    } catch (error) {
        return res.status(500).json({ error: `Database error.` })
    }
})

// Room routes
app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await Room.findAll();
        return res.send(rooms);
    } catch (error) {
        return res.status(500).json({ error: `Database error.` })
    }
})

// Room Types
app.get('/api/room-types', async (req, res) => {
    try {
        const room_types = await RoomType.findAll();
        return res.send(room_types);
    } catch (error) {
        res.status(500).json({ error: "Error fetching room-types." })
    }
})

// Guest routes
app.get('/api/guests', async (req, res) => {
    try {
        const guest = await Guest.findAll();
        return res.send(guest)
    } catch (error) {
        return res.status(500).json({ error: 'No Guests were found.' })
    }
})

sequelize.sync({ force: true }).then(async () => {
    // Fake Room Data's
    const rooms = await Room.bulkCreate([
        {
            roomNumber: 101,
            status: "available",
            pricePerNight: 1500.0,
            floorNumber: 1
        },
        {
            roomNumber: 102,
            status: "available",
            pricePerNight: 1800.0,
            floorNumber: 1
        },
        {
            roomNumber: 201,
            status: "available",
            pricePerNight: 2200.0,
            floorNumber: 2
        }
    ]);

    // Fake Room Types data's
    const room_types = await RoomType.bulkCreate([
        {
            typeName: "Single",
            description: "A cozy room for one guest with a single bed.",
            maxCapacity: 1,
            basePrice: 50.00
        },
        {
            typeName: "Double",
            description: "Comfortable room with a double bed, suitable for two guests.",
            maxCapacity: 2,
            basePrice: 80.00
        },
        {
            typeName: "Suite",
            description: "Spacious suite with living area and king-size bed.",
            maxCapacity: 4,
            basePrice: 150.00
        },
        {
            typeName: "Family Room",
            description: "Large room with multiple beds for family stays.",
            maxCapacity: 5,
            basePrice: 200.00
        }
    ]);


    console.log("\x1b[35m%s\x1b[0m", "Database synced.");
    app.listen(PORT, () => {
        console.log("\x1b[35m%s\x1b[0m", `Server listening to port ${PORT}`);
    })
})