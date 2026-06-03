# Vehicle Booking Full-Stack Application

## Description
A modern, scalable, and fully normalized Full-Stack application designed for an end-to-end vehicle booking system. It features a robust Node.js backend with an MVC architecture and a responsive React frontend powered by Vite and Material UI. The application supports role-based access control, allowing both users and administrators to securely manage vehicle bookings.

## Problem Statement
Traditional vehicle booking processes are often manual, error-prone, and lack real-time synchronization between administrators and users. Furthermore, existing systems often struggle with inefficient database designs, leading to poor query performance and scaling issues as the volume of bookings, customers, and drivers grows.

## Solution
This project provides a comprehensive digital platform that streamlines the vehicle booking lifecycle. By implementing a highly normalized MongoDB schema (separating Bookings, Customers, Drivers, and Vehicles), the backend ensures data integrity and high-performance querying. The frontend offers intuitive dashboards for both admins and users, ensuring a seamless experience for scheduling, tracking, and managing rides.

## Features
- **User Authentication:** Secure JWT-based Role-Based Access Control (RBAC) with hashed passwords for Users and Admins.
- **Admin Dashboard:** Comprehensive tools for administrators to manage vehicles, drivers, and monitor all bookings.
- **User Dashboard:** Dedicated interfaces for users to view available vehicles, book rides, and manage their profiles.
- **Advanced Querying:** High-performance data retrieval supporting pagination, sorting, and regex-based searching on the backend.
- **Normalized Relational Schema:** Data is intelligently distributed across collections to prevent redundancy and improve scalability.
- **Centralized Error Handling:** Global async error wrappers and standardized API responses.

## Tech Stack
### Frontend
- **Framework:** React (Vite)
- **State Management:** Redux Toolkit
- **Styling & UI:** Material UI (MUI), Tailwind CSS, Emotion
- **Routing:** React Router DOM
- **Forms & Validation:** Formik, Yup

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Security:** bcryptjs, jsonwebtoken, cors, express-rate-limit

## Folder Structure
```text
.
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handling logic
│   │   ├── models/           # Mongoose schemas (Booking, Customer, Driver, Vehicle)
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic layer
│   │   └── ...
│   ├── .env
│   ├── package.json
│   └── README.md             # Backend specific documentation
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components & Layouts (Navbar, Sidebar)
│   │   ├── pages/            # View components (Admin/User Dashboards, Auth)
│   │   ├── store/            # Redux store and slices
│   │   ├── hooks/            # Custom React hooks
│   │   └── ...
│   └── package.json
├── API_Routes_Temp.md        # API route reference
└── README.md                 # Project root documentation
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/daksh006v/vehicle_bookings_bajaniya_daksh.git
   cd vehicle_bookings_bajaniya_daksh
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=development
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

## API Documentation & Testing
A complete Postman collection is included in this repository to facilitate immediate API testing.
You can find it at: `backend/Vehicle_Booking.postman_collection.json`. Simply import this file into Postman to test all endpoints!

---
*Developed by Daksh Bajaniya*
