# Food Ordering App - Frontend

A modern Next.js frontend application for the Food Ordering System.

## Features

- 🔐 **Authentication**: JWT-based login system
- 🍽️ **Restaurant Browsing**: View restaurants filtered by country
- 📋 **Menu Display**: Browse menu items for each restaurant
- 🛒 **Order Management**: Create, view, and cancel orders
- 👤 **Role-Based Access**: Different features for ADMIN, MANAGER, and MEMBER roles
- 🌍 **Country-Based Filtering**: Users see restaurants from their country
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **JWT Decode** - Token parsing
- **js-cookie** - Cookie management

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8080` (or configure via environment variable)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── restaurants/       # Restaurant listing and detail pages
│   ├── orders/            # Order management page
│   └── admin/             # Admin-only pages
├── components/            # Reusable React components
│   ├── Layout.tsx         # Main layout with navigation
│   └── ProtectedRoute.tsx # Route protection component
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utility libraries
│   ├── api.ts            # API client
│   └── auth.ts           # Authentication utilities
└── types/                 # TypeScript type definitions
    └── index.ts          # Shared types
```

## User Roles

### ADMIN
- View all restaurants (all countries)
- Create restaurants
- Create orders
- Cancel orders
- Update payment methods

### MANAGER
- View restaurants (own country only)
- Create orders
- Cancel orders
- View own orders

### MEMBER
- View restaurants (own country only)
- View own orders

## Test Accounts

- **ADMIN**: `nick.fury` / `password123`
- **MANAGER (India)**: `captain.marvel` / `password123`
- **MANAGER (America)**: `captain.america` / `password123`
- **MEMBER (India)**: `thanos` / `password123` or `thor` / `password123`
- **MEMBER (America)**: `travis` / `password123`

## API Integration

The frontend communicates with the Spring Boot backend API. Ensure the backend is running and accessible at the configured `NEXT_PUBLIC_API_URL`.

### API Endpoints Used

- `POST /api/auth/login` - User authentication
- `GET /api/restaurants` - List restaurants
- `GET /api/restaurants/{id}` - Get restaurant details
- `POST /api/restaurants` - Create restaurant (ADMIN only)
- `GET /api/menu-items/restaurant/{id}` - Get menu items
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `POST /api/orders/{id}/cancel` - Cancel order
- `PATCH /api/orders/{id}/payment-method` - Update payment method (ADMIN only)

## Features in Detail

### Authentication
- JWT token stored in cookies
- Automatic token validation
- Redirect to login on unauthorized access
- Role-based route protection

### Restaurant Browsing
- Country-filtered restaurant list
- Restaurant detail pages with menu
- Responsive card-based layout

### Order Management
- Shopping cart functionality
- Order creation with payment method selection
- Order history with status tracking
- Order cancellation (for pending orders)

### Admin Features
- Restaurant creation form
- Payment method updates
- Full access to all features

## Development

### Code Style
- TypeScript strict mode enabled
- ESLint configured
- Tailwind CSS for styling

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: http://localhost:8080)

## License

This project is part of a take-home assignment.
