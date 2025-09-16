# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Architecture

This is a full-stack hotel management system with a clear separation between frontend and backend:

### Backend (Node.js/Express/Sequelize)
- **Framework**: Express.js with CORS enabled
- **Database**: SQLite with Sequelize ORM
- **Models**: Guest, Reservation, Room, RoomType with defined relationships
- **API**: RESTful endpoints for hotel operations

### Frontend (Vue 3/TypeScript/Vite)
- **Framework**: Vue 3 with TypeScript and Composition API
- **State Management**: Pinia store for hotel data
- **Styling**: UnoCSS for utility-first CSS
- **Build Tool**: Vite with Vue DevTools

### Database Schema & Relationships
The database follows this relationship model:
- **Guest** has many **Reservations** (1:N)
- **Room** has many **Reservations** (1:N) 
- **RoomType** has many **Rooms** (1:N)
- **Reservation** belongs to **Guest** and **Room** (N:1)
- **Room** belongs to **RoomType** (N:1)

## Development Commands

### Backend Development
```powershell
# Navigate to backend directory
cd backend

# Install dependencies (if needed)
npm install

# Start the server (uses port 3000)
node server.js
```

### Frontend Development
```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

### Running Both Services
Backend must be started first (port 3000), then frontend dev server.

## Key Architecture Patterns

### Backend Patterns
- **Transaction-based reservations**: Uses Sequelize transactions for data integrity
- **Database initialization**: Runs `sequelize.sync({ force: true })` on startup, seeding sample data
- **Model factory pattern**: Each model is defined as a factory function accepting sequelize instance
- **RESTful API design**: Standard CRUD operations with proper HTTP status codes

### Frontend Patterns
- **Composition API**: Uses Vue 3's Composition API throughout
- **Centralized state**: Hotel data managed via Pinia store (`hotelStore.ts`)
- **Component composition**: Modular component structure in `component/` directory
- **Type safety**: Comprehensive TypeScript interfaces in `types/hotel.ts`

### Data Flow
1. Backend seeds SQLite database with sample rooms and room types on startup
2. Frontend fetches data via API calls to backend endpoints
3. Hotel store manages application state and provides computed properties for filtering
4. Components consume store data through reactive computed properties

## API Endpoints

### Reservations
- `POST /api/reserve-room` - Create new reservation (requires guest and room data)
- `GET /api/reservations` - Fetch all reservations

### Rooms & Room Types  
- `GET /api/rooms` - Fetch all rooms
- `GET /api/room-types` - Fetch all room types

### Guests
- `GET /api/guests` - Fetch all guests

## Important Implementation Details

### Backend Database Initialization
- Database is recreated on every server start (`force: true`)
- Sample data is seeded automatically (3 rooms, 4 room types)
- SQLite database file: `system.db`

### Frontend State Management
- Main hotel store in `stores/hotelStore.ts` manages room categories, reservations, and UI state
- Store provides filtering capabilities for rooms and reservations
- Date range management for 14-day calendar view
- Modal state management for reservation details

### Component Structure
- Main application entry: `page/Receptionist.vue`
- Component organization:
  - `component/` - Main application components (Frontdesk, Sidebar, etc.)
  - `component/frontdesk/` - Front desk specific components
  - `auth/` - Authentication related components

### Styling and UI
- UnoCSS for utility-first CSS framework
- Iconify icons with Lucide icon set
- Responsive design considerations
- Color schemes defined in hotel store for consistency

## Testing Strategy

Currently no tests are configured. When adding tests:
- Backend: Consider using Jest with Supertest for API testing
- Frontend: Vue Test Utils with Vitest would be appropriate
- Database: Use separate test database or in-memory SQLite

## Development Notes

### Backend Port Configuration
Server defaults to port 3000 (`PORT = undefined || 3000`)

### Database Considerations
- Current setup recreates database on each restart - not suitable for production
- Guest creation uses `findOrCreate` to prevent duplicates based on `idDocument` and `email`

### Frontend Development Server
Vite dev server with hot reload, Vue DevTools integration, and TypeScript support.

## Common Issues and Solutions

### Import Issues
If you encounter TypeScript import errors:

1. **Vue component imports**: Ensure `env.d.ts` includes proper Vue module declarations
2. **Undefined reservations**: Use proper null checking when working with `getReservation()` function
3. **Date operations**: Convert Date objects to timestamps when using `Math.min/max` operations
4. **Component props/emits**: Use `defineProps` and `defineEmits` in the correct order within setup scripts

### Build Issues
If build fails:
- Run `npm run type-check` in frontend directory to identify TypeScript errors
- Check for missing imports or incorrect file paths
- Ensure all Vue components follow proper Composition API patterns

### Filtering System
The frontend includes a filtering system for the hotel management interface:

#### Filter Types:
- **Room Types**: Single, Double, Family (maps to Standard Single, Twin Double, Family Suite)
- **Reservation Types**: Standard, Premium, VIP, Group Booking, Family
- **Booking Status**: Confirmed, Pending, Cancelled, Checked In
- **Search**: By room number, guest name, or booking ID

#### Filter Implementation:
- Filters are reactive and update the display in real-time
- Default values are set to "All" options to show all data initially
- Room type filtering matches partial text in room type names
- Reservation filtering uses exact type/status matching

### Reservation Display System
The frontend displays reservations as continuous spans across multiple days:

#### Features:
- **Continuous Blocks**: Reservations appear as single blocks spanning from check-in to check-out dates
- **Guest Name Display**: Guest name appears once per reservation instead of repeating daily
- **Hover Effects**: Reservation blocks scale and show shadow on hover
- **Click Interaction**: Clicking on any part of a reservation opens the reservation modal
- **Overlay System**: Reservations are rendered as overlays on top of the date grid for proper alignment

#### Implementation:
- Uses CSS Grid with absolute positioning for precise span placement
- Computed property calculates start/end columns for each reservation
- Spans automatically adjust to visible date range
- Colors are driven by data configuration in `hotelData.json`

#### Color Coding:
- **Standard Reservations**: Blue (`bg-blue-100 text-blue-800`)
- **VIP Reservations**: Yellow (`bg-yellow-100 text-yellow-800`)
- **Group Bookings**: Orange (`bg-orange-100 text-orange-800`) 
- **Family Reservations**: Green (`bg-green-100 text-green-800`)
- **Room Status**: Available (green), Occupied (red), Maintenance (yellow)
- **Fallback System**: Built-in fallback colors ensure all reservations are always visible

#### Troubleshooting:
- **Missing Colors**: If reservations appear without colors, check that `hotelData.json` contains `reservationTypeColors`
- **Layering Issues**: Reservation spans use z-index 20 to appear above grid cells
- **CSS Classes**: All color classes are validated with fallbacks to prevent invisible text
- **Double Borders**: Grid uses consistent `border-r` approach instead of overlapping `outline` classes
- **Unwanted Lines**: Removed all unnecessary container borders and outlines for clean grid appearance
- **Reservation Overlays**: Spans use negative margins to fully cover underlying grid cell borders
