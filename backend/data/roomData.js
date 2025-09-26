// Room Types Data
export const roomTypesData = [
    {
        typeName: 'Standard Single',
        description: 'Cozy single room with queen bed, perfect for solo travelers',
        maxCapacity: 1,
        basePrice: 75.00
    },
    {
        typeName: 'Deluxe Single',
        description: 'Premium single room with king bed and city view',
        maxCapacity: 1,
        basePrice: 95.00
    },
    {
        typeName: 'Standard Double',
        description: 'Comfortable double room with queen bed for couples',
        maxCapacity: 2,
        basePrice: 110.00
    },
    {
        typeName: 'Twin Room',
        description: 'Room with two single beds, ideal for friends or colleagues',
        maxCapacity: 2,
        basePrice: 115.00
    },
    {
        typeName: 'Deluxe Double',
        description: 'Spacious double room with king bed and balcony',
        maxCapacity: 2,
        basePrice: 140.00
    },
    {
        typeName: 'Triple Room',
        description: 'Room with three single beds for small groups',
        maxCapacity: 3,
        basePrice: 160.00
    },
    {
        typeName: 'Family Suite',
        description: 'Large family room with separate sleeping areas',
        maxCapacity: 4,
        basePrice: 200.00
    },
    {
        typeName: 'Executive Suite',
        description: 'Luxury suite with living area and premium amenities',
        maxCapacity: 2,
        basePrice: 280.00
    },
    {
        typeName: 'Presidential Suite',
        description: 'Ultimate luxury with multiple rooms and exclusive services',
        maxCapacity: 4,
        basePrice: 450.00
    }
];

// Room Inventory Data
export const roomsData = [
    // Ground Floor (0) - Standard and Budget Rooms
    { roomNumber: '001', roomTypeId: 1, floorNumber: 0, pricePerNight: 75.00, status: 'available' }, // Standard Single
    { roomNumber: '002', roomTypeId: 1, floorNumber: 0, pricePerNight: 75.00, status: 'available' }, // Standard Single
    { roomNumber: '003', roomTypeId: 3, floorNumber: 0, pricePerNight: 110.00, status: 'available' }, // Standard Double
    { roomNumber: '004', roomTypeId: 3, floorNumber: 0, pricePerNight: 110.00, status: 'available' }, // Standard Double
    { roomNumber: '005', roomTypeId: 4, floorNumber: 0, pricePerNight: 115.00, status: 'available' }, // Twin Room

    // First Floor (1) - Mixed Standard and Deluxe Rooms
    { roomNumber: '101', roomTypeId: 2, floorNumber: 1, pricePerNight: 95.00, status: 'available' }, // Deluxe Single
    { roomNumber: '102', roomTypeId: 3, floorNumber: 1, pricePerNight: 110.00, status: 'available' }, // Standard Double
    { roomNumber: '103', roomTypeId: 4, floorNumber: 1, pricePerNight: 115.00, status: 'available' }, // Twin Room
    { roomNumber: '104', roomTypeId: 5, floorNumber: 1, pricePerNight: 140.00, status: 'available' }, // Deluxe Double
    { roomNumber: '105', roomTypeId: 4, floorNumber: 1, pricePerNight: 115.00, status: 'available' }, // Twin Room
    { roomNumber: '106', roomTypeId: 5, floorNumber: 1, pricePerNight: 140.00, status: 'available' }, // Deluxe Double
    { roomNumber: '107', roomTypeId: 6, floorNumber: 1, pricePerNight: 160.00, status: 'available' }, // Triple Room
    { roomNumber: '108', roomTypeId: 3, floorNumber: 1, pricePerNight: 110.00, status: 'available' }, // Standard Double
    { roomNumber: '109', roomTypeId: 6, floorNumber: 1, pricePerNight: 160.00, status: 'available' }, // Triple Room
    { roomNumber: '110', roomTypeId: 5, floorNumber: 1, pricePerNight: 140.00, status: 'available' }, // Deluxe Double

    // Second Floor (2) - Premium Rooms and Suites
    { roomNumber: '201', roomTypeId: 7, floorNumber: 2, pricePerNight: 200.00, status: 'available' }, // Family Suite
    { roomNumber: '202', roomTypeId: 5, floorNumber: 2, pricePerNight: 145.00, status: 'available' }, // Deluxe Double
    { roomNumber: '203', roomTypeId: 7, floorNumber: 2, pricePerNight: 200.00, status: 'available' }, // Family Suite
    { roomNumber: '204', roomTypeId: 6, floorNumber: 2, pricePerNight: 165.00, status: 'available' }, // Triple Room
    { roomNumber: '205', roomTypeId: 8, floorNumber: 2, pricePerNight: 280.00, status: 'available' }, // Executive Suite
    { roomNumber: '206', roomTypeId: 7, floorNumber: 2, pricePerNight: 200.00, status: 'available' }, // Family Suite
    { roomNumber: '207', roomTypeId: 8, floorNumber: 2, pricePerNight: 280.00, status: 'available' }, // Executive Suite

    // Third Floor (3) - Luxury Suites
    { roomNumber: '301', roomTypeId: 8, floorNumber: 3, pricePerNight: 290.00, status: 'available' }, // Executive Suite
    { roomNumber: '302', roomTypeId: 8, floorNumber: 3, pricePerNight: 290.00, status: 'available' }, // Executive Suite
    { roomNumber: '303', roomTypeId: 9, floorNumber: 3, pricePerNight: 450.00, status: 'available' }, // Presidential Suite
    { roomNumber: '304', roomTypeId: 8, floorNumber: 3, pricePerNight: 290.00, status: 'available' }, // Executive Suite
    { roomNumber: '305', roomTypeId: 9, floorNumber: 3, pricePerNight: 450.00, status: 'available' }  // Presidential Suite
];

// Helper function to get amenities by room type
export const getAmenitiesByType = (roomTypeId) => {
    const baseAmenities = ['WiFi', 'Air Conditioning', 'TV', 'Private Bathroom'];
    switch(roomTypeId) {
        case 1: // Standard Single
            return [...baseAmenities, 'Work Desk', 'Coffee Maker'];
        case 2: // Deluxe Single
            return [...baseAmenities, 'City View', 'Mini Bar', 'Work Desk', 'Premium Bedding'];
        case 3: // Standard Double
            return [...baseAmenities, 'Queen Bed', 'Seating Area'];
        case 4: // Twin Room
            return [...baseAmenities, 'Two Single Beds', 'Work Desk'];
        case 5: // Deluxe Double
            return [...baseAmenities, 'King Bed', 'Balcony', 'Mini Bar', 'Premium Bedding'];
        case 6: // Triple Room
            return [...baseAmenities, 'Three Single Beds', 'Extra Space'];
        case 7: // Family Suite
            return [...baseAmenities, 'Separate Sleeping Areas', 'Kitchenette', 'Living Area', 'Sofa Bed'];
        case 8: // Executive Suite
            return [...baseAmenities, 'Living Room', 'Premium Amenities', 'City View', 'Mini Bar', 'Work Area', 'Premium Bedding'];
        case 9: // Presidential Suite
            return [...baseAmenities, 'Multiple Rooms', 'Luxury Amenities', 'Panoramic View', 'Butler Service', 'Jacuzzi', 'Dining Area'];
        default:
            return baseAmenities;
    }
};

// Helper function to get room type description
export const getRoomTypeDescription = (roomTypeId) => {
    const types = {
        1: 'Standard Single', 2: 'Deluxe Single', 3: 'Standard Double', 
        4: 'Twin Room', 5: 'Deluxe Double', 6: 'Triple Room',
        7: 'Family Suite', 8: 'Executive Suite', 9: 'Presidential Suite'
    };
    return types[roomTypeId] || 'Standard Room';
};

// Helper function to get status color
export const getStatusColor = (status) => {
    switch (status) {
        case 'available':
            return 'bg-green-100 text-green-700';
        case 'occupied':
            return 'bg-red-100 text-red-700';
        case 'maintenance':
            return 'bg-yellow-100 text-yellow-700';
        case 'out-of-order':
            return 'bg-gray-100 text-gray-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};
