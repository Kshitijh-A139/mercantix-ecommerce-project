# Mercantix — Full-Stack E-Commerce

A production-style e-commerce application: a **React 19 + Tailwind CSS v4** storefront on a
**Spring Boot 3.2 + MySQL** backend, secured with stateless **JWT** auth and role-based access.

> Luxury fashion storefront with real product browsing, search, filtering, cart, checkout,
> order history, and an admin console.

---

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 19, React Router 7, Tailwind CSS v4, Vite, Axios, Lucide, Sonner |
| Backend   | Java 17, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA / Hibernate 6 |
| Database  | MySQL 8 (schema managed by **Flyway** migrations) |
| Testing   | JUnit 5, Mockito, AssertJ, H2 (test context), Spring Security Test |

---

## Architecture

```
mercantix/
├── src/main/java/com/mercantix/app/   # Spring Boot backend
│   ├── usercontrollers/               # REST controllers (auth, products, cart, orders, admin)
│   ├── userservices/ + userserviceimplementations/   # Service contracts + impls
│   ├── userrepositories/              # Spring Data JPA repositories
│   ├── entities/                      # JPA entities (+ OrderStatus, Role)
│   ├── dto/                           # Request/response DTOs (API contract)
│   ├── security/                      # JWT filter, JwtService, UserDetailsService
│   ├── config/                        # SecurityConfig, CorsConfig, GlobalExceptionHandler
│   └── exceptions/                    # Domain exceptions → HTTP status mapping
├── src/main/resources/db/migration/   # Flyway: V1 schema, V2 seed data
└── frontend/                          # React + Vite storefront and admin console
    └── src/
        ├── pages/  components/  context/  services/  admin/
```

**Layering:** controllers depend on service *contracts* (interfaces); services own transactions
and business rules; repositories handle persistence; DTOs decouple the API from JPA entities.

---

## Prerequisites

- **JDK 17+**
- **Node.js 18+**
- **MySQL 8** running on `localhost:3306`

---

## Running locally

### 1. Database

The schema and seed data are applied automatically by **Flyway** on first boot — you only need an
empty database. For a clean first run (e.g. if an older schema exists):

```sql
DROP DATABASE IF EXISTS mercantix;
CREATE DATABASE mercantix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend (port 9090)

Configuration lives in `src/main/resources/application.properties` and is fully overridable via
environment variables:

| Variable | Default | Notes |
|----------|---------|-------|
| `DATABASE_URL` | `jdbc:mysql://localhost:3306/mercantix` | |
| `DATABASE_USERNAME` / `DATABASE_PASSWORD` | `root` / `root` | |
| `JWT_SECRET` | dev default | **Must** be a 64+ byte secret in prod |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:5174` | |

```bash
./mvnw spring-boot:run
```

Flyway will create the tables and seed the catalogue + demo users.

### 3. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

`VITE_API_BASE_URL` (see `frontend/.env.development`) points the SPA at the backend.

---

## Demo accounts (seeded by `V2__seed_data.sql`)

| Role     | Username | Password      |
|----------|----------|---------------|
| Admin    | `admin`  | `admin123`    |
| Customer | `demo`   | `customer123` |

> New self-registrations are **always** created as `CUSTOMER`. Admins are provisioned via
> migration only — the API never lets a client choose its own role.

---

## API overview (`/api` prefix)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/auth/register` `/auth/login` | public | Register (CUSTOMER) / login → JWT |
| GET  | `/auth/me` | user | Current user |
| GET  | `/products` | public | Paginated list — `q`, `category`, `minPrice`, `maxPrice`, `sortBy`, `sortDir`, `page`, `size` |
| GET  | `/products/{id}` `/categories` | public | Product detail / distinct categories |
| GET/POST/PUT/DELETE | `/cart` … | user | Cart management (per authenticated user) |
| GET/POST | `/orders` `/orders/{id}` | user | Place / list / view own orders |
| `*` | `/admin/**` | **ADMIN** | Product CRUD, users, stats, order management |

---

## Notable engineering decisions

- **Server-authoritative pricing.** `POST /api/orders` ignores any client-supplied price/total —
  line prices and the order total are computed from the persisted product records, stock is
  validated and decremented inside the same transaction (no overselling), and products are
  batch-loaded to avoid N+1 queries. Covered by `OrderServiceTest`.
- **Flyway-owned schema.** Migrations are the source of truth; Hibernate runs in `validate` mode
  (`none` of its DDL auto-generation) so entity ↔ schema drift fails fast at startup.
- **Stateless JWT** (HS512) with BCrypt password hashing, method- and URL-level role guards, and a
  JSON `GlobalExceptionHandler` for consistent error shapes.
- **Lazy-collection safety.** Order queries use `@EntityGraph` so responses serialize correctly
  with `open-in-view=false`; responses are DTOs, never raw entities.
- **Frontend**: route-level code splitting, an app-level error boundary, real loading/skeleton and
  error states, optimistic cart with guest→server merge, and accessible, responsive UI.

---

## Tests

```bash
./mvnw test          # backend: services (incl. security), domain rules, context load (H2)
cd frontend && npm run lint && npm run build
```
