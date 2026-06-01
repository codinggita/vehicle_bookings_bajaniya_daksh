# 🚗 Vehicle Booking Backend API

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

A robust, scalable, and fully normalized RESTful API for a Vehicle Booking System, built with Node.js, Express, and MongoDB. This backend strictly adheres to the Model-View-Controller (MVC) architectural pattern.

## 🔗 Live Deployment
The backend API is deployed and accessible at:
**[https://vehicle-bookings-bajaniya-daksh.onrender.com](https://vehicle-bookings-bajaniya-daksh.onrender.com)**

## 🌟 Features

- **Strict MVC Architecture:** Clean separation of concerns with dedicated controllers, services, and models.
- **Normalized Relational Schema:** Data is intelligently distributed across `Booking`, `Customer`, `Driver`, and `Vehicle` collections.
- **JWT Authentication:** Secure Role-Based Access Control (RBAC) with hashed passwords.
- **Advanced Querying & Aggregation:** High-performance data retrieval supporting pagination, sorting, Regex-based searching, and complex MongoDB aggregation pipelines.
- **Centralized Error Handling:** Global async error wrapper (`catchAsync`) prevents unhandled promise rejections.
- **Standardized API Responses:** Uniform JSON response structure (`{ success, message, data, error }`) across all endpoints.
- **Request Logging:** Custom middleware for tracking incoming HTTP requests.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Security:** JSON Web Tokens (JWT), bcryptjs, CORS

## 📁 Folder Structure

```text
backend/
├── config/           # Environment variables and database connection
├── controllers/      # Express route handlers (Request/Response logic)
├── middleware/       # Custom middleware (JWT auth, Logging, Rate Limiting)
├── models/           # Mongoose schemas (Relational DB structure)
├── routes/           # API route definitions
├── services/         # Core business logic and MongoDB queries
├── utils/            # Helper utilities (catchAsync, responseHandler)
├── server.js         # Application entry point
└── .env              # Environment configuration variables
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas URI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/daksh006v/vehicle_bookings_bajaniya_daksh.git
   cd vehicle_bookings_bajaniya_daksh/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root of the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=development
   ```

4. **Start the Server**
   - Development Mode (with hot-reloading):
     ```bash
     npm run dev
     ```
   - Production Mode:
     ```bash
     npm start
     ```

## 🗄️ Database & Schema Design
This project migrated from a flat schema to a deeply normalized relational database:
- **`Customer`**: User identities and customer ratings.
- **`Driver`**: Driver identities and performance metrics.
- **`Vehicle`**: Vehicle configurations and types.
- **`Booking`**: The core transactional model containing references (`ObjectId`) to Customers, Drivers, and Vehicles.

> **Note on Data Seeding:** If migrating from legacy datasets, ensure your data is properly seeded into these four distinct collections to prevent broken references.

## 🌐 API Endpoints Reference

Below is a detailed overview of the core endpoints exposed by the backend. All routes are prefixed with `/api`. The API extensively supports query parameters for filtering, sorting, and pagination.

### 🔐 Authentication & Users (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Register a new user account | Public |
| **POST** | `/auth/login` | Login and receive JWT token | Public |
| **GET** | `/auth/me` | Fetch authenticated user profile | Private (JWT) |

### 📅 Bookings Core (`/api/bookings`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/bookings` | Fetch all bookings (supports `page`, `limit`, `sort`) | Public |
| **GET** | `/bookings/:bookingId` | Fetch a specific booking by ID | Public |
| **POST** | `/bookings` | Create a new booking | Public |
| **PATCH** | `/bookings/:bookingId/status` | Partially update a booking's status | Public |
| **PUT** | `/bookings/:bookingId` | Completely replace a booking | Public |
| **DELETE**| `/bookings/:bookingId` | Delete a booking | Public |

*Advanced Booking Queries (Examples):*
- `GET /api/bookings?status=Success` (Filter by status)
- `GET /api/bookings?minFare=500&maxFare=2000` (Filter by fare range)
- `GET /api/bookings?sort=-Booking_Value` (Sort descending by fare)

### 🔍 Search & Filtering (`/api/search`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/search?keyword=...` | Global case-insensitive regex search across fields | Public |
| **GET** | `/search/location?pickup=...` | Search specifically by pickup or drop location | Public |
| **GET** | `/search/vehicle?type=...` | Search by vehicle type | Public |
| **GET** | `/search/payment?method=...` | Search by payment method (e.g., UPI, Cash) | Public |
| **GET** | `/search/rating?driver=...` | Search by specific driver or customer ratings | Public |

### 📊 Statistics & Aggregation (`/api/stats`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/stats/total-bookings` | Aggregated count of total platform bookings | Public |
| **GET** | `/stats/success-rides` | Aggregated count of completed/successful rides | Public |
| **GET** | `/stats/cancelled-rides`| Aggregated count of cancelled rides | Public |
| **GET** | `/stats/highest-fare` | Retrieve the highest fare ever recorded | Public |
| **GET** | `/stats/top-vehicle` | Retrieve the most frequently booked vehicle type | Public |

### 🛡️ Admin & Protected Routes (`/api/admin`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/admin/dashboard` | Access admin dashboard statistics | Admin Only |
| **GET** | `/admin/bookings` | Fetch all bookings with admin visibility | Admin Only |
| **PATCH** | `/admin/bookings/:id` | Force update any booking record | Admin Only |
| **DELETE**| `/admin/bookings/:id` | Force delete any booking record | Admin Only |

## 📖 API Documentation & Testing

A complete Postman collection is included in this repository to facilitate immediate API testing.

1. Open Postman.
2. Click **Import** and select the `Vehicle_Booking.postman_collection.json` file located in the root of the `backend/` directory.
3. Authenticate via `/api/auth/login` to retrieve your JWT, and place it in the `Authorization` header (`Bearer <token>`) for protected routes.

## 📄 License
This project is proprietary and developed for evaluation purposes.
