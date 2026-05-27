# 🚗 Vehicle Booking Backend API

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

A robust, scalable, and fully normalized RESTful API for a Vehicle Booking System, built with Node.js, Express, and MongoDB. This backend strictly adheres to the Model-View-Controller (MVC) architectural pattern.

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

## 📖 API Documentation & Testing

A complete Postman collection is included in this repository to facilitate immediate API testing.

1. Open Postman.
2. Click **Import** and select the `Vehicle_Booking.postman_collection.json` file located in the root of the `backend/` directory.
3. Authenticate via `/api/auth/login` to retrieve your JWT, and place it in the `Authorization` header (`Bearer <token>`) for protected routes.

## 📄 License
This project is proprietary and developed for evaluation purposes.
