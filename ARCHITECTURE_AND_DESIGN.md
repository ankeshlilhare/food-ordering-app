# Architecture & Design

This document gives a concise overview of the application's architecture, main components, technology choices, and API contract highlights.

1) High-level architecture
- Frontend: Next.js + TypeScript + Tailwind CSS
  - Provides pages for browsing restaurants, viewing menus, ordering, and admin pages for managing restaurants/menu items.
- Backend: Spring Boot (REST API)
  - exposes REST endpoints under `/api/*` for authentication, restaurants, menu items, and orders.
- Database: MySQL (schema defined by JPA entities and seeded via `data.sql`)

2) Component responsibilities
- Authentication
  - JWT-based login implemented at `/api/auth/login`.
  - Tokens include `role` and `countryId` to enforce RBAC and country-scoped access.
- Restaurants & MenuItems
  - `Restaurant` entity contains `image_url` and `country_id`.
  - `MenuItem` entity contains `image_url`, price, availability.
- Orders
  - Orders and OrderItems track line items and total amount; currency is stored per order.

3) Security & RBAC
- Roles: ADMIN, MANAGER, MEMBER
- ADMIN has global access; MANAGER and MEMBER are scoped by country
- Sensitive endpoints require server-side RBAC checks (e.g., create/delete restaurant restricted to ADMIN)

4) CORS & Preflight
- CORS configuration allows `GET, POST, PUT, DELETE, OPTIONS` and supports credentials; ensure frontend origin is allowed when deployed.

5) API Contract Highlights
- `POST /api/auth/login` => { username, password } => { token }
- `GET /api/restaurants` => returns list of `RestaurantDTO` (includes `imageUrl`)
- `POST /api/restaurants` (ADMIN) => create restaurant
- `DELETE /api/restaurants/{id}` (ADMIN) => delete restaurant
- `GET /api/menu-items/restaurant/{id}` => returns menu items for restaurant
- `POST /api/orders` => create order (includes items and payment method)

6) Data Flow (example - place order)
1. User selects menu items in frontend
2. Frontend sends POST `/api/orders` with items and user token
3. Backend validates token, constructs Order, persists to DB
4. Backend returns created order response; frontend shows order confirmation

7) Deployment hints
- Use environment variables for DB credentials and `server.port`.
- Enable HTTPS and a reverse proxy in production (e.g., Nginx).
- Generate an OpenAPI/Swagger spec (recommended) to improve developer onboarding.

8) Notes & Extensions
- Consider storing uploaded images in object storage (S3) instead of direct URLs for production.
- Add unit/integration tests for critical RBAC endpoints.
