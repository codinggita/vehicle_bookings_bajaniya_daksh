# 🚗 Vehicle Booking Full-Stack Application

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

Welcome to the **Vehicle Bookings** project! This repository contains a robust, scalable, and fully normalized Full-Stack application designed for a modern vehicle booking system.

## 🗂️ Project Structure

This monorepo is organized into two main workspaces:

- 🎨 **[`frontend/`](./frontend)**: *(Coming Soon)* Will contain the modern, responsive user interface.
- ⚙️ **[`backend/`](./backend)**: Contains the fully functional RESTful API, built with strict MVC architecture using Node.js, Express, and MongoDB.

---

## ⚙️ Backend Overview

The backend has been completely architected to meet industry standards. For detailed API documentation, folder structure, and backend-specific instructions, please refer to the **[Backend README](./backend/README.md)**.

### 🌟 Key Backend Features
- **Strict MVC Architecture:** Clean separation of concerns with dedicated controllers, services, and models.
- **Normalized Relational Schema:** Data is intelligently distributed across `Booking`, `Customer`, `Driver`, and `Vehicle` collections.
- **JWT Authentication:** Secure Role-Based Access Control (RBAC) with hashed passwords.
- **Advanced Querying:** High-performance data retrieval supporting pagination, sorting, Regex-based searching, and complex MongoDB aggregation pipelines.
- **Centralized Error Handling:** Global async error wrapper prevents unhandled promise rejections.
- **Standardized API Responses:** Uniform JSON response structure across all endpoints.

## 🚀 Getting Started

To get the backend up and running locally, follow these quick steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/daksh006v/vehicle_bookings_bajaniya_daksh.git
   cd vehicle_bookings_bajaniya_daksh
   ```

2. **Navigate to the Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=development
   ```

4. **Start the Server**
   ```bash
   npm run dev
   ```

## 📖 API Documentation & Testing

A complete Postman collection is included in this repository to facilitate immediate API testing.
You can find it at: `backend/Vehicle_Booking.postman_collection.json`. Simply import this file into Postman to test all endpoints!

---
*Developed by Daksh Bajaniya*
