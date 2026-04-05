# 🏡 HomeLinker – Full Stack Real Estate Platform

---

## 🚀 Project Overview

HomeLinker is a **production-ready full-stack real estate web application** that allows users to browse, create, and manage property listings while securely connecting with property owners.

It combines a **modern React frontend** with a **scalable Node.js backend**, following real-world development practices.

---

## 🌐 Live Demo

- 🔗 **Frontend (Netlify)**  
  https://classy-creponne-f6e3ff.netlify.app/

- ⚙️ **Backend API (Vercel)**  
  https://backend-realestate-ubz6.vercel.app/

---

## ⚡ Highlights

- 🔥 Full-stack MERN-style architecture
- 🔐 Secure authentication (JWT + Google OAuth)
- 🏘️ Real-world CRUD functionality
- 🌐 Fully deployed (Netlify + Vercel)
- 📱 Responsive UI with modern design

---

## 🚀 Features

### 🔐 Authentication

- Email & Password login/signup
- Google OAuth integration
- JWT authentication with HTTP-only cookies

### 🏘️ Property Listings

- Create, update, and delete listings
- Search and explore properties
- View detailed property pages

### 📩 Communication

- Contact property owners via email

### 🔒 Security

- Protected frontend routes
- Token-based backend authorization

### 📱 UI/UX

- Fully responsive design
- Clean UI with Tailwind CSS
- Fast performance using Vite

---

## 🛠️ Tech Stack

### Frontend

- React (Vite)
- React Router DOM
- Tailwind CSS
- Fetch API

### Backend

- Node.js
- Express.js
- MongoDB Atlas + Mongoose
- JWT (jsonwebtoken)
- Google OAuth
- cookie-parser
- cors
- dotenv

---

## 🏗️ Project Structure

```bash
HomeLinker/
│
├── frontend/   # React (Vite) application
├── backend/    # Node.js + Express API
└── README.md

⚙️ Setup & Installation
1️⃣ Clone Repositories
git clone https://github.com/marryamabid/frontend-realestate.git
git clone https://github.com/marryamabid/backend-realestate.git
2️⃣ Setup Backend
cd backend-realestate
npm install

Create a .env file:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id

Run backend:

npm run dev
3️⃣ Setup Frontend
cd frontend-realestate
npm install
npm run dev
📡 API Overview
🔑 Auth
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/google
POST /api/auth/logout
👤 User
GET /api/user/:id
PUT /api/user/:id
DELETE /api/user/:id
🏘️ Listings
POST /api/listing
GET /api/listing/:id
PUT /api/listing/:id
DELETE /api/listing/:id
GET /api/listing/search
🔗 Frontend ↔ Backend Integration
REST API communication via Fetch API
CORS configured for secure cross-origin requests
Environment variables used for API base URLs
🌍 Deployment
Frontend: Netlify
Backend: Vercel
Database: MongoDB Atlas
🧠 Challenges & Solutions
🔐 Authentication Security
Implemented JWT with HTTP-only cookies to prevent XSS attacks
🔄 State Management
Managed global user state for protected routes
🌍 CORS Issues
Configured backend to allow secure frontend communication
⚡ Performance Optimization
Used Vite for faster builds and efficient rendering
📈 What I Learned
Building and deploying full-stack applications
Implementing secure authentication systems
Managing frontend-backend communication
Handling real-world deployment challenges
💼 Why This Project Matters

This project demonstrates my ability to:

Build scalable full-stack applications
Design responsive and user-friendly interfaces
Implement secure authentication systems
Deploy production-ready applications
📸 Screenshots

Add screenshots here (Home, Listings, Login, etc.)

👩‍💻 Author

Marryam Abid
Full Stack Developer

⭐ Future Improvements
🔍 Advanced filtering (price, location, category)
❤️ Wishlist / favorites
💬 Real-time chat system
🗺️ Google Maps integration
📄 License

This project is licensed under the MIT License.
```
