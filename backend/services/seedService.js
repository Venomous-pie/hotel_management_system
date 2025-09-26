import { Room, RoomType } from '../models/index.js';
import { 
    roomTypesData, 
    roomsData, 
    getAmenitiesByType, 
    getRoomTypeDescription, 
    getStatusColor 
} from '../data/roomData.js';

// Seed data function
export const seedData = async () => {
    try {
        console.log("\x1b[36m%s\x1b[0m", "Seeding database with initial data...");

        // Create diverse room types
        const roomTypes = await RoomType.bulkCreate(roomTypesData, { ignoreDuplicates: true });
        console.log("\x1b[36m%s\x1b[0m", "Room types created successfully");

        // Create rooms with proper status colors and type-specific amenities
        const roomsWithColors = roomsData.map(room => ({
            ...room,
            RoomTypeId: room.roomTypeId,
            statusColor: getStatusColor(room.status),
            amenities: JSON.stringify(getAmenitiesByType(room.roomTypeId)),
            notes: `${getRoomTypeDescription(room.roomTypeId)} on floor ${room.floorNumber}. ${
                room.floorNumber === 3 ? 'Premium location with enhanced services.' : 
                room.floorNumber === 2 ? 'Mid-level with great amenities.' : 
                'Ground level with easy access.'
            }`
        }));

        await Room.bulkCreate(roomsWithColors, { ignoreDuplicates: true });

        console.log("\x1b[36m%s\x1b[0m", `Successfully created ${roomsData.length} rooms across 4 floors`);
        console.log("\x1b[36m%s\x1b[0m", "Room Distribution:");
        console.log("\x1b[36m%s\x1b[0m", "  Floor 0: 5 rooms (Standard Singles, Doubles, Twin)");
        console.log("\x1b[36m%s\x1b[0m", "  Floor 1: 10 rooms (Mixed Standard & Deluxe)");
        console.log("\x1b[36m%s\x1b[0m", "  Floor 2: 7 rooms (Premium & Family Suites)");
        console.log("\x1b[36m%s\x1b[0m", "  Floor 3: 5 rooms (Luxury Executive & Presidential Suites)");
        console.log("\x1b[32m%s\x1b[0m", "Database seeding completed with diverse room types!");

    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", "Error seeding database:", error);
    }
};
