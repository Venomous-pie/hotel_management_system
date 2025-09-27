import express from 'express';
import cors from 'cors';
import { sequelize, Guest, Reservation, Room, RoomType } from './models/index.js';
import { seedData } from './services/seedService.js';
import { getStatusColor } from './data/roomData.js';
import { Op } from 'sequelize';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// ---- Date helpers ----
const normalizeToStartOfDay = (dateInput) => {
  // Handle date strings in YYYY-MM-DD format to avoid timezone issues
  if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateInput.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0, 0); // month is 0-indexed
  }
  
  const d = new Date(dateInput);
  d.setHours(0, 0, 0, 0);
  return d;
};
const calculateNights = (startDate, endDate) => {
  const MS_DAY = 24 * 60 * 60 * 1000;
  return Math.round((endDate.getTime() - startDate.getTime()) / MS_DAY);
};
// Overlap helper with exclusive checkout logic
// Overlap if: existing.checkIn < newCheckOut AND existing.checkOut > newCheckIn
const buildOverlapWhere = ({ roomId, startDate, endDate, excludeId }) => ({
  RoomId: roomId,
  status: { [Op.ne]: 'cancelled' },
  ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
  [Op.and]: [
    { checkIn: { [Op.lt]: endDate } },
    { checkOut: { [Op.gt]: startDate } }
  ]
});


app.get('/', (req, res) => {
    res.send('DB is correct lol.')
})

// Manual seeding endpoint for debugging
app.post('/api/seed', async (req, res) => {
    try {
        console.log("\x1b[33m%s\x1b[0m", "Manual seeding requested via API...");
        await seedData();
        
        const roomCount = await Room.count();
        const roomTypeCount = await RoomType.count();
        
        res.json({ 
            success: true, 
            message: "Database seeded successfully",
            data: {
                roomTypes: roomTypeCount,
                rooms: roomCount
            }
        });
    } catch (error) {
        console.error('Manual seeding failed:', error);
        res.status(500).json({ 
            success: false, 
            error: `Seeding failed: ${error.message}` 
        });
    }
})

// Reservation routes
app.post('/api/reserve-room', async (req, res) => {
    let t;
    try {
        const { firstName, middleName, lastName,
            email, phone, address, idDocument,
            numGuest, checkIn, checkOut, specialRequest,
            status, totalPrice, roomNumber, roomId } = req.body;

        if (!firstName || !lastName ||
            !email || !phone || !address || !idDocument ||
            !numGuest || !checkIn || !checkOut || !status) {
            return res.status(400).json({ error: "Required fields are missing." })
        }

        // Accept either roomNumber or roomId (both represent the visible room number)
        const selectedRoomNumber = (roomNumber ?? roomId ?? '').toString();
        if (!selectedRoomNumber) {
            return res.status(400).json({ error: "Room identifier (roomNumber or roomId) is required." });
        }

        // Date validation
        const checkInDate = normalizeToStartOfDay(checkIn);
        const checkOutDate = normalizeToStartOfDay(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Debug logging to verify date handling
        console.log('🔧 Backend date processing:', {
            checkInInput: checkIn,
            checkOutInput: checkOut,
            checkInProcessed: checkInDate.toISOString(),
            checkOutProcessed: checkOutDate.toISOString(),
            checkInLocal: checkInDate.toLocaleDateString(),
            checkOutLocal: checkOutDate.toLocaleDateString()
        });

        if (checkInDate < today) {
            return res.status(400).json({ error: "Check-in date cannot be in the past." });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ error: "Check-out date must be after check-in date." });
        }

        // Guest capacity validation
        const guestCount = Number(numGuest);
        if (guestCount < 1 || guestCount > 10) {
            return res.status(400).json({ error: "Number of guests must be between 1 and 10." });
        }
        // Guest record will be created inside transaction after conflict check

        // Find room by roomNumber since frontend sends room.number as ID
        const room = await Room.findOne({
            where: { roomNumber: selectedRoomNumber },
            include: [{
                model: RoomType,
                attributes: ['maxCapacity', 'basePrice']
            }]
        });

        if (!room) {
            return res.status(404).json({ error: `Room with number: ${selectedRoomNumber} doesn't exist.` });
        }

        // Check room capacity
        if (guestCount > room.RoomType.maxCapacity) {
            return res.status(400).json({ 
                error: `Room ${selectedRoomNumber} can accommodate maximum ${room.RoomType.maxCapacity} guests. You selected ${guestCount} guests.` 
            });
        }

        // Check for conflicting reservations (exclusive checkout logic)
        const conflictingReservation = await Reservation.findOne({
            where: buildOverlapWhere({ roomId: room.id, startDate: checkInDate, endDate: checkOutDate })
        });

        if (conflictingReservation) {
            return res.status(409).json({ 
                error: `Room ${selectedRoomNumber} is already booked for the selected dates.`,
                conflictingReservation: {
                    checkIn: conflictingReservation.checkIn,
                    checkOut: conflictingReservation.checkOut
                }
            });
        }

        // Start transaction only for writes
        t = await sequelize.transaction();

        const [guest] = await Guest.findOrCreate({
            where: { idDocument, email },
            defaults: {
                phone,
                email,
                firstName,
                middleName: middleName || null,
                lastName,
                address
            },
            transaction: t
        })

        const nights = calculateNights(checkInDate, checkOutDate);
        const nightlyRate = room.pricePerNight || room.RoomType.basePrice || 0;
        const finalTotalPrice = (typeof totalPrice === 'number' && totalPrice > 0) ? totalPrice : (nightlyRate * nights);

        const reservation = await Reservation.create({
            numGuest: guestCount,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            specialRequest,
            status,
            totalPrice: finalTotalPrice,
            roomNumber: selectedRoomNumber,
            RoomId: room.id,
            GuestId: guest.id
        }, { transaction: t });

        await t.commit();

        res.status(201).json({ reservation })
    } catch (error) {
        if (t) await t.rollback();
        return res.status(500).json({ error: `Error message: ${error.message || error}` })
    }
});

app.get('/api/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            include: [
                {
                    model: Guest,
                    attributes: ['firstName', 'middleName', 'lastName', 'email', 'phone']
                },
                {
                    model: Room,
                    attributes: ['roomNumber']
                }
            ],
            order: [['checkIn', 'ASC'], ['createdAt', 'DESC']]
        });

        // Transform data to match frontend expectations
        const transformedReservations = reservations.map(reservation => ({
            id: reservation.id.toString(),
            room: reservation.Room?.roomNumber?.toString() || 'N/A',
            guest: `${reservation.Guest?.firstName || ''} ${reservation.Guest?.middleName ? reservation.Guest.middleName + ' ' : ''}${reservation.Guest?.lastName || ''}`.trim(),
            checkIn: reservation.checkIn,
            checkOut: reservation.checkOut,
            status: reservation.status,
            type: 'standard', // Default type since not in backend model yet
            amount: reservation.totalPrice || 0,
            balance: 0, // Calculate or set default
            source: 'direct', // Default source
            orders: 0, // Default orders
            bookingDate: reservation.createdAt,
            notes: reservation.specialRequest || ''
        }));

        return res.json(transformedReservations);
    } catch (error) {
        console.error('Reservations fetch error:', error);
        return res.status(500).json({ error: `Database error: ${error.message}` })
    }
})

// Update reservation
app.put('/api/reservations/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status, checkIn, checkOut, numGuest, specialRequest, totalPrice } = req.body;

        const reservation = await Reservation.findByPk(id, { transaction: t });
        if (!reservation) {
            await t.rollback();
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Normalize dates (if provided) and validate
        const newCheckIn = checkIn ? normalizeToStartOfDay(checkIn) : reservation.checkIn;
        const newCheckOut = checkOut ? normalizeToStartOfDay(checkOut) : reservation.checkOut;
        if (newCheckOut <= newCheckIn) {
            await t.rollback();
            return res.status(400).json({ error: 'Check-out date must be after check-in date.' });
        }

        // Validate guest count range
        const newNumGuest = typeof numGuest === 'number' ? numGuest : reservation.numGuest;
        if (newNumGuest < 1 || newNumGuest > 10) {
            await t.rollback();
            return res.status(400).json({ error: 'Number of guests must be between 1 and 10.' });
        }

        // Capacity check
        const room = await Room.findByPk(reservation.RoomId, {
            include: [{ model: RoomType, attributes: ['maxCapacity'] }],
            transaction: t
        });
        if (!room) {
            await t.rollback();
            return res.status(404).json({ error: 'Room not found for reservation' });
        }
        if (newNumGuest > (room.RoomType?.maxCapacity || 0)) {
            await t.rollback();
            return res.status(400).json({ error: `Room ${room.roomNumber} can accommodate maximum ${room.RoomType?.maxCapacity || 0} guests. You selected ${newNumGuest} guests.` });
        }

        // Conflict detection excluding current reservation
        const conflict = await Reservation.findOne({
            where: buildOverlapWhere({ roomId: room.id, startDate: newCheckIn, endDate: newCheckOut, excludeId: reservation.id }),
            transaction: t
        });
        if (conflict) {
            await t.rollback();
            return res.status(409).json({
                error: `Room ${room.roomNumber} is already booked for the selected dates.`,
                conflictingReservation: { checkIn: conflict.checkIn, checkOut: conflict.checkOut }
            });
        }

        await reservation.update({
            status: status ?? reservation.status,
            checkIn: newCheckIn,
            checkOut: newCheckOut,
            numGuest: newNumGuest,
            specialRequest: specialRequest ?? reservation.specialRequest,
            totalPrice: (typeof totalPrice === 'number' && totalPrice >= 0) ? totalPrice : reservation.totalPrice
        }, { transaction: t });

        await t.commit();
        res.json({ message: 'Reservation updated successfully', reservation });
    } catch (error) {
        await t.rollback();
        console.error('Reservation update error:', error);
        return res.status(500).json({ error: `Error updating reservation: ${error.message}` })
    }
})

// Delete reservation
app.delete('/api/reservations/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;

        const reservation = await Reservation.findByPk(id, { transaction: t });
        if (!reservation) {
            await t.rollback();
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Support soft delete via query ?soft=true -> mark as cancelled
        if (req.query.soft === 'true') {
            await reservation.update({ status: 'cancelled' }, { transaction: t });
            await t.commit();
            return res.json({ message: 'Reservation cancelled successfully' });
        }

        await reservation.destroy({ transaction: t });
        await t.commit();
        return res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        await t.rollback();
        console.error('Reservation delete error:', error);
        return res.status(500).json({ error: `Error deleting reservation: ${error.message}` })
    }
})

// Room routes
app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await Room.findAll({
            include: [{
                model: RoomType,
                attributes: ['typeName', 'description', 'maxCapacity', 'basePrice']
            }],
            where: { isActive: true },
            order: [['roomNumber', 'ASC']]
        });

        // Transform data to match frontend expectations
        const transformedRooms = rooms.map(room => ({
            id: room.roomNumber, // Use room number as ID for frontend compatibility
            number: room.roomNumber,
            type: room.RoomType?.typeName || 'Standard',
            status: room.status,
            statusColor: room.statusColor,
            pricePerNight: room.pricePerNight,
            floorNumber: room.floorNumber,
            maxCapacity: room.RoomType?.maxCapacity || 2,
            amenities: room.amenities ? JSON.parse(room.amenities) : [],
            notes: room.notes
        }));

        return res.json(transformedRooms);
    } catch (error) {
        console.error('Rooms fetch error:', error);
        return res.status(500).json({ error: `Database error: ${error.message}` })
    }
})

// Admin route to add new room (placeholder for future admin functionality)
app.post('/api/admin/rooms', async (req, res) => {
    try {
        const { 
            roomNumber, 
            roomTypeId, 
            pricePerNight, 
            floorNumber, 
            amenities, 
            notes 
        } = req.body;

        if (!roomNumber || !roomTypeId || !pricePerNight || !floorNumber) {
            return res.status(400).json({ error: "Required fields: roomNumber, roomTypeId, pricePerNight, floorNumber" });
        }

        // Check if room number already exists
        const existingRoom = await Room.findOne({ where: { roomNumber } });
        if (existingRoom) {
            return res.status(409).json({ error: "Room number already exists" });
        }

        const room = await Room.create({
            roomNumber,
            RoomTypeId: roomTypeId,
            pricePerNight,
            floorNumber,
            amenities: amenities ? JSON.stringify(amenities) : null,
            notes
        });

        res.status(201).json({ 
            message: 'Room created successfully', 
            room: {
                id: room.id,
                roomNumber: room.roomNumber,
                status: room.status,
                pricePerNight: room.pricePerNight,
                floorNumber: room.floorNumber
            }
        });
    } catch (error) {
        console.error('Room creation error:', error);
        return res.status(500).json({ error: `Error creating room: ${error.message}` });
    }
})

// Admin route to update room (placeholder for future admin functionality)
app.put('/api/admin/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, pricePerNight, amenities, notes, isActive } = req.body;

        const room = await Room.findByPk(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        await room.update({
            status: status || room.status,
            pricePerNight: pricePerNight || room.pricePerNight,
            amenities: amenities ? JSON.stringify(amenities) : room.amenities,
            notes: notes !== undefined ? notes : room.notes,
            isActive: isActive !== undefined ? isActive : room.isActive,
            statusColor: getStatusColor(status || room.status)
        });

        res.json({ message: 'Room updated successfully', room });
    } catch (error) {
        console.error('Room update error:', error);
        return res.status(500).json({ error: `Error updating room: ${error.message}` });
    }
})

// Admin route to delete/deactivate room (placeholder for future admin functionality)
app.delete('/api/admin/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { permanent = false } = req.query;

        const room = await Room.findByPk(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (permanent === 'true') {
            await room.destroy();
            res.json({ message: 'Room permanently deleted' });
        } else {
            await room.update({ isActive: false });
            res.json({ message: 'Room deactivated' });
        }
    } catch (error) {
        console.error('Room delete error:', error);
        return res.status(500).json({ error: `Error deleting room: ${error.message}` });
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

app.post('/api/guests', async (req, res) => {
    try {
        const { firstName, middleName, lastName, email, phone, address, idDocument } = req.body;

        if (!firstName || !lastName || !email || !phone || !address || !idDocument) {
            return res.status(400).json({ error: "Required fields are missing." })
        }

        const guest = await Guest.create({
            firstName,
            middleName: middleName || null,
            lastName,
            email,
            phone,
            address,
            idDocument
        });

        res.status(201).json({ guest })
    } catch (error) {
        return res.status(500).json({ error: `Error creating guest: ${error.message}` })
    }
})

const FORCE_SYNC = process.env.FORCE_SYNC === 'true';
const SEED_ON_START = (process.env.SEED_ON_START === 'true') || FORCE_SYNC;

sequelize.sync({ force: FORCE_SYNC }).then(async () => {
    // Apply SQLite performance/concurrency PRAGMAs
    try {
        await sequelize.query('PRAGMA journal_mode = WAL;')
        await sequelize.query('PRAGMA busy_timeout = 5000;')
        console.log('\x1b[35m%s\x1b[0m', 'SQLite PRAGMAs applied: journal_mode=WAL, busy_timeout=5000ms')
    } catch (e) {
        console.warn('Failed to apply SQLite PRAGMAs:', e)
    }
    console.log("\x1b[35m%s\x1b[0m", `Database synced. force=${FORCE_SYNC}`);
    
    // Check if database is empty and seed if needed
    const roomCount = await Room.count();
    const roomTypeCount = await RoomType.count();
    
    if (SEED_ON_START || roomCount === 0 || roomTypeCount === 0) {
        console.log("\x1b[33m%s\x1b[0m", "Database appears empty or seeding requested. Seeding with initial data...");
        await seedData();
    } else {
        console.log("\x1b[32m%s\x1b[0m", `Database already contains ${roomCount} rooms and ${roomTypeCount} room types. Skipping seeding.`);
    }
    
    app.listen(PORT, () => {
        console.log("\x1b[35m%s\x1b[0m", `Server listening to port ${PORT}`);
        console.log("\x1b[33m%s\x1b[0m", "Hotel Management System Backend Ready!");
        console.log("\x1b[33m%s\x1b[0m", "Available Admin Routes:");
        console.log("\x1b[33m%s\x1b[0m", "  POST /api/admin/rooms - Add new room");
        console.log("\x1b[33m%s\x1b[0m", "  PUT /api/admin/rooms/:id - Update room");
        console.log("\x1b[33m%s\x1b[0m", "  DELETE /api/admin/rooms/:id - Delete/deactivate room");
    })
}).catch((err) => {
    console.error('Sequelize sync failed:', err);
    process.exit(1);
});