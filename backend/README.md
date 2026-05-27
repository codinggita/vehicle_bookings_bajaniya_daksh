# Vehicle Booking Backend API

This backend provides a RESTful API for a vehicle booking system, designed using Node.js, Express.js, and MongoDB. The architecture strictly follows the MVC (Model-View-Controller) pattern with normalized database schemas and clean separation of concerns.

## 🚀 Features & Evaluation Criteria Completed
- **Clean MVC Architecture**: Business logic is separated into `services/`, and HTTP handling is managed by `controllers/`.
- **Relational MongoDB Schemas**: Normalized models (`Booking`, `Customer`, `Driver`, `Vehicle`) with strict field validation, enums, and timestamp tracking.
- **Advanced Querying**: Search, filtering, pagination, and sorting on bookings.
- **Aggregation Pipelines**: Data aggregation endpoints (e.g., top vehicles, fare stats).
- **JWT Authentication**: Secure user authentication.
- **Centralized Error Handling**: `catchAsync` wrapper removes redundant try-catch blocks.
- **Standardized API Responses**: Every API returns a consistent `{ success, message, data, error }` JSON structure.
- **Environment Configuration**: Centralized DB setup in `config/db.js`.
- **Request Logging**: Custom middleware to log incoming HTTP requests.

## 📁 Folder Structure
- `config/` - Environment variables and database connection (`db.js`).
- `controllers/` - Express route handlers parsing requests and returning responses.
- `middleware/` - Custom middleware (JWT auth, Request Logger, Rate Limiting).
- `models/` - Mongoose schemas (relational DB structure).
- `routes/` - API route definitions.
- `services/` - Business logic and MongoDB queries (decoupled from controllers).
- `utils/` - Utility functions (`catchAsync.js`, `responseHandler.js`).

## ⚙️ Setup Instructions
1. **Install Dependencies**: `npm install`
2. **Environment Variables**: Create a `.env` file in the root backend directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
3. **Run Server**: 
   - Development: `npm run dev` (if nodemon is installed)
   - Production: `node server.js`

## 🗄️ Data Migration / Seeding
Since the schema was upgraded from a generic flat `Data` model to normalized relational collections (`Customer`, `Driver`, `Vehicle`, `Booking`), you will need to seed your database using the new schema structure. Ensure that `Customer_ID`, `Driver_ID`, and `Vehicle_Type` in your `Booking` references match the actual documents in those respective collections.

## 🧪 Postman API Testing
To test these APIs via Postman:
1. Export your Postman collection and include it in this repository (e.g., `Vehicle_Booking.postman_collection.json`).
2. The Base URL is `http://localhost:5000/api`.
3. Use the `/api/auth/login` endpoint to retrieve a JWT token, and place it in the **Authorization** header (`Bearer <token>`) for protected routes.
