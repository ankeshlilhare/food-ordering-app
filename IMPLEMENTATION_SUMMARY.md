# Food Ordering Application - Implementation Summary

## Overview
A comprehensive web-based food ordering application with Role-Based Access Control (RBAC) and Country-based Access restrictions.

---

## Problem Statement & Objectives

### Business Structure
- **Admin**: Nick Fury (Business Owner)
- **Managers** (2):
  - Captain Marvel (India)
  - Captain America (America)
- **Team Members** (3):
  - Thanos (India)
  - Thor (India)
  - Travis (America)

---

## ✅ IMPLEMENTED FEATURES

### 1. **View Restaurants & Menu Items** 
   - **Permitted Roles**: ADMIN ✓, MANAGER ✓, MEMBER ✓
   - **Implementation**:
     - All authenticated users can view restaurants
     - ADMIN: Can view all restaurants globally
     - MANAGER/MEMBER: Can only view restaurants in their assigned country
     - All users can view menu items for restaurants
     - Menu items include images, descriptions, prices, and categories
   - **Files Modified**:
     - `RestaurantService.java` - Country-based filtering logic
     - `RestaurantController.java` - GET /api/restaurants endpoint
     - `MenuItemController.java` - GET /api/menu-items/restaurant/{id} endpoint
     - `src/app/restaurants/page.tsx` - Frontend display

---

### 2. **Create Order (Add Food Items to Cart)**
   - **Permitted Roles**: ADMIN ✓, MANAGER ✓, MEMBER ✗
   - **Implementation**:
     - Only ADMIN and MANAGER can add items to cart
     - MEMBER users see disabled "Add to Cart" buttons
     - MEMBER users see informational message about their limitations
     - Cart functionality is hidden for MEMBER users
     - Visual feedback with disabled/unavailable buttons
   - **Files Modified**:
     - `src/app/restaurants/[id]/page.tsx` - Cart UI with role-based restrictions
     - `useAuth()` hook provides role information

---

### 3. **Place Order (Checkout & Pay)**
   - **Permitted Roles**: ADMIN ✓, MANAGER ✓, MEMBER ✗
   - **Implementation**:
     - Checkout button only visible for ADMIN/MANAGER
     - MEMBER users receive error message if they try to checkout
     - Payment method selection (Credit Card, Debit Card, Cash)
     - Backend validation ensures only authorized roles can place orders
     - Order creation with automatic redirect to orders page
   - **Files Modified**:
     - `OrderService.java` - Backend order creation logic
     - `OrderController.java` - POST /api/orders endpoint
     - `src/app/restaurants/[id]/page.tsx` - Checkout button with RBAC

---

### 4. **Cancel Order**
   - **Permitted Roles**: ADMIN ✓, MANAGER ✓, MEMBER ✗
   - **Implementation**:
     - "Cancel Order" button only visible for ADMIN/MANAGER
     - MEMBER users cannot see cancel option
     - Only PENDING orders can be cancelled
     - Backend validation ensures authorization
   - **Files Modified**:
     - `OrderService.java` - cancelOrder() method with RBAC
     - `OrderController.java` - POST /api/orders/{id}/cancel endpoint
     - `src/app/orders/page.tsx` - Cancel button with role check

---

### 5. **Update Payment Method**
   - **Permitted Roles**: ADMIN ✓, MANAGER ✓, MEMBER ✗
   - **Implementation**:
     - "Update Payment" button only visible for ADMIN/MANAGER
     - MEMBER users cannot modify payment methods
     - Payment methods: CREDIT_CARD, DEBIT_CARD, CASH
     - Backend validation enforces role restrictions
   - **Files Modified**:
     - `OrderService.java` - updatePaymentMethod() with RBAC
     - `OrderController.java` - PATCH /api/orders/{id}/payment-method
     - `src/app/orders/page.tsx` - Update button with role check

---

### 6. **Add Menu Item** (BONUS Feature)
   - **Permitted Roles**: ADMIN ✓, MANAGER ✓, MEMBER ✗
   - **Implementation**:
     - Only ADMIN and MANAGER can add menu items
     - Form includes: name, description, price, category, image URL
     - Live image preview
     - Country-based restaurant filtering
     - Image support with Unsplash integration
   - **Files Modified**:
     - `MenuItemService.java` - createMenuItem() method with RBAC
     - `MenuItemController.java` - POST /api/menu-items/restaurant/{id}
     - `src/app/add-menu-item/page.tsx` - Form page with RBAC
     - `src/components/Layout.tsx` - Navigation link

---

## 🔐 ROLE-BASED ACCESS CONTROL (RBAC)

| Function | ADMIN | MANAGER | MEMBER |
|----------|-------|---------|--------|
| View Restaurants & Menu Items | ✓ | ✓ | ✓ |
| Create Order (Add Items) | ✓ | ✓ | ✗ |
| Place Order (Checkout & Pay) | ✓ | ✓ | ✗ |
| Cancel Order | ✓ | ✓ | ✗ |
| Update Payment Method | ✓ | ✓ | ✗ |
| Add Menu Item | ✓ | ✓ | ✗ |

---

## 🌍 COUNTRY-BASED ACCESS CONTROL (BONUS)

### Access Rules
- **ADMIN**: Global access to all countries and restaurants
- **MANAGER**: Restricted to their assigned country
  - Captain Marvel (India) → Only sees Indian restaurants
  - Captain America (America) → Only sees American restaurants
- **MEMBER**: Restricted to their assigned country
  - Thanos (India) → Only sees Indian restaurants
  - Thor (India) → Only sees Indian restaurants
  - Travis (America) → Only sees American restaurants

### Implementation
- Backend filtering in `RestaurantService.getAllRestaurants()`
- JWT token includes user's country information
- All API endpoints validate country-based access
- Frontend respects backend access restrictions

---

## 🏗️ ARCHITECTURE

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5.7
- **Database**: MySQL 8.0
- **Security**: JWT Token-based authentication
- **ORM**: Hibernate/JPA

**Key Components**:
- `Controller` → REST API endpoints with RBAC
- `Service` → Business logic with authorization checks
- `Repository` → Data access layer
- `Entity` → Domain models
- `DTO` → Data transfer objects
- `Config/JwtAuthenticationFilter` → JWT validation and role extraction

### Frontend (Next.js)
- **Framework**: Next.js 16.0.3
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios

**Key Components**:
- `AuthContext` → User authentication and role management
- `ProtectedRoute` → Route access control
- `Layout` → Navigation with role-based links
- `apiClient` → HTTP requests with JWT token
- Pages → Feature-specific implementations

---

## 🗄️ DATABASE SCHEMA

### Tables
1. **users** - User accounts with roles and country assignments
2. **roles** - ADMIN, MANAGER, MEMBER
3. **countries** - India (ID: 1), America (ID: 2)
4. **restaurants** - Restaurant details with country FK
5. **menu_items** - Food items with images and restaurant FK
6. **orders** - Order records with user and restaurant FK
7. **order_items** - Order line items with quantity and price

---

## 📝 TEST CREDENTIALS

### ADMIN User
- **Username**: nick.fury
- **Password**: password123
- **Country**: None (Global access)

### MANAGER - India
- **Username**: captain.marvel
- **Password**: password123
- **Country**: India

### MANAGER - America
- **Username**: captain.america
- **Password**: password123
- **Country**: America

### MEMBER - India
- **Username**: thanos or thor
- **Password**: password123
- **Country**: India

### MEMBER - America
- **Username**: travis
- **Password**: password123
- **Country**: America

---

## 🚀 RUNNING THE APPLICATION

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8.0
- Maven 3.8+
- npm or yarn

### Backend Setup
```bash
cd food-ordering-app
mvn clean install -DskipTests
java -jar target/food-ordering-app-0.0.1-SNAPSHOT.jar
```
Backend runs on: `http://localhost:8080`

### Frontend Setup
```bash
cd food-ordering-frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000`

---

## 📸 Features Showcase

### 1. Login Page
- Simple, clean login interface
- JWT token-based authentication
- Email/username and password input

### 2. Restaurants Page
- Grid layout of available restaurants
- Restaurant images, cuisine type, address
- Country location display
- Filtered by user's country (except ADMIN)

### 3. Restaurant Detail Page
- Large restaurant header image
- Menu items grid with:
  - Item images
  - Description
  - Price
  - Category badges
  - Add to Cart buttons (ADMIN/MANAGER only)
- Cart sidebar with:
  - Item quantity adjustment
  - Total calculation
  - Payment method selection
  - Checkout button (ADMIN/MANAGER only)
- Informational message for MEMBER users

### 4. Add Menu Item Page (ADMIN/MANAGER)
- Form with fields:
  - Restaurant selection dropdown
  - Item name
  - Description
  - Price
  - Category (Appetizer, Main Course, Dessert, Beverage)
  - Image URL with live preview
- Success/error messages
- Redirect to restaurant page after creation

### 5. Orders Page
- List of user's orders
- Order status badges (PENDING, CONFIRMED, CANCELLED)
- Order items breakdown
- Payment method display
- Action buttons:
  - Cancel Order (ADMIN/MANAGER only)
  - Update Payment Method (ADMIN/MANAGER only)

### 6. Navigation
- Dynamic menu based on user role
- Role and country display in user profile
- Logout functionality
- Responsive mobile menu

---

## 🔒 Security Features

1. **JWT Authentication**
   - Token-based API requests
   - Role and country information in token
   - Token expiration handling
   - Automatic logout on token expiry

2. **Authorization**
   - Route-level access control (Frontend)
   - API endpoint-level access control (Backend)
   - Button visibility based on roles
   - Double-check on backend for all operations

3. **Country-Based Isolation**
   - Users can only access their country's data
   - ADMIN has global access
   - Backend enforces all restrictions

---

## 📊 Data Relationships

```
Countries (1:M) Restaurants
Restaurants (1:M) MenuItems
Restaurants (1:M) Orders
Users (1:M) Orders
Orders (1:M) OrderItems
MenuItems (1:M) OrderItems
Users (1:M) Roles
Countries (1:M) Users
```

---

## 🎯 Key Implementation Details

### Frontend Authentication Flow
1. User logs in with credentials
2. Backend returns JWT token
3. Token stored in browser cookies
4. Token automatically included in API requests
5. User info decoded from token for role checks
6. Routes protected with `ProtectedRoute` component

### Backend Authorization Flow
1. JWT token intercepted in `JwtAuthenticationFilter`
2. Token validated and decoded
3. Role and country extracted and added to request attributes
4. Controller/Service methods check role and country
5. Database queries filtered by country if applicable

### Country-Based Data Filtering
1. User's country ID stored in JWT token
2. Service methods receive role and country
3. SQL queries filtered: `findByCountryIdAndIsActiveTrue()`
4. Responses contain only country-relevant data
5. Frontend displays filtered results

---

## ✨ Completed Requirements

### Primary Requirements
- ✅ View restaurants and menu items (all roles with country filtering)
- ✅ Create orders with food items (ADMIN/MANAGER only)
- ✅ Checkout and pay with payment methods (ADMIN/MANAGER only)
- ✅ Cancel orders (ADMIN/MANAGER only)
- ✅ Update payment methods (ADMIN/MANAGER only)

### RBAC Implementation
- ✅ Proper role-based access control for all functions
- ✅ MEMBER cannot create, place, cancel orders, or update payments
- ✅ ADMIN has full access
- ✅ MANAGER has limited access (cannot create restaurants)

### Bonus: Country-Based Access
- ✅ Managers and Members restricted to their country
- ✅ ADMIN has global access
- ✅ Data filtering at both backend and frontend
- ✅ Users cannot access other countries' restaurants/data

### Additional Features
- ✅ Menu item images with Unsplash integration
- ✅ Add menu item functionality for ADMIN/MANAGER
- ✅ Beautiful UI with Tailwind CSS
- ✅ Responsive design for all screen sizes
- ✅ Error handling and validation
- ✅ Success messages and feedback

---

## 🎓 Design Patterns Used

1. **MVC Pattern** - Controllers, Services, Repositories
2. **DTO Pattern** - Data Transfer Objects for API responses
3. **Repository Pattern** - Database abstraction layer
4. **Service Pattern** - Business logic separation
5. **Context API Pattern** - React state management
6. **JWT Pattern** - Token-based authentication
7. **RBAC Pattern** - Role-based access control
8. **Country-based Access Control** - Relational access model

---

## 📈 Future Enhancements

1. Advanced search and filtering
2. Restaurant ratings and reviews
3. Order history with analytics
4. Email notifications
5. Push notifications
6. Delivery tracking
7. Admin dashboard with statistics
8. Promotional codes and discounts
9. Multi-language support
10. Payment gateway integration (Stripe, PayPal)

---

## 📞 Support & Contact

For questions or issues, please refer to the code comments and implementation details above.

---

**Last Updated**: November 16, 2025  
**Application Status**: ✅ Complete and Running
