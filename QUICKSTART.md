# 🚀 Smart Expense Split & Reminder System - Quick Start Guide

A professional, production-ready MERN stack application for managing shared expenses.

## ⚡ Quick Start (5 Minutes)

### 1. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your MongoDB URI
# Start server
npm run dev
```

Server runs on: `http://localhost:5000`

### 2. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

App opens at: `http://localhost:3000`

### 3. Test the Application
1. Click "Get Started" on the landing page
2. Register with your email
3. Create your first group
4. Add some expenses
5. Check the dashboard and reports

---

## 📋 Project Overview

### What's Included

✅ **Complete Backend**
- Express.js REST API with MVC structure
- MongoDB integration with Mongoose
- JWT authentication
- All required controllers and models
- Error handling middleware
- API validation

✅ **Complete Frontend**
- React.js with React Router
- Beautiful Tailwind CSS interface
- Responsive design (mobile-first)
- All necessary pages and components
- Context API for state management
- Charts and analytics with Recharts

✅ **Database Models**
- User authentication
- Groups management
- Expenses tracking
- Payments system
- Notifications

### Features Implemented

- 👤 User Authentication (Register/Login/Logout)
- 💰 Expense Management (Add/Edit/Delete)
- 👥 Group Management (Create/Manage Groups)
- 💳 Payment Tracking (Mark Settled)
- 📊 Analytics & Reports (Charts/Graphs)
- 📱 Responsive Design
- 🔐 Secure JWT Auth
- 📧 Email Notifications (Ready)

---

## 📁 Directory Structure

```
DB project/
├── backend/
│   ├── config/              # Database config
│   ├── controllers/         # Business logic
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth middleware
│   ├── .env.example         # Environment template
│   ├── server.js            # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API integration
│   │   ├── context/         # State management
│   │   ├── styles/          # CSS
│   │   ├── App.js           # Main app
│   │   └── index.js         # Entry point
│   ├── public/              # Static files
│   ├── tailwind.config.js   # Tailwind config
│   └── package.json
│
├── README.md                # Full documentation
├── BACKEND_SETUP.md         # Backend guide
├── FRONTEND_SETUP.md        # Frontend guide
└── package.json             # Root config
```

---

## 🔧 Prerequisites

Before starting, ensure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Local](https://docs.mongodb.com/manual/installation/) or [Atlas Cloud](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** - Comes with Node.js
- **Git** - For version control

---

## 🛠️ Installation

### Option A: Full Installation Script

```bash
# Run from project root
npm run install:all
```

### Option B: Manual Installation

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
cd ..
```

---

## 🎯 Configuration

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-split
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Production Build

```bash
# Frontend build
cd frontend
npm run build

# Backend is ready as-is
cd ../backend
npm start
```

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - Get all user groups
- `GET /api/groups/:id` - Get group details
- `POST /api/groups/:id/add-member` - Add member
- `POST /api/groups/:id/remove-member` - Remove member
- `DELETE /api/groups/:id` - Delete group

### Expenses
- `POST /api/expenses` - Add expense
- `GET /api/expenses/:groupId` - Get group expenses
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Payments
- `GET /api/payments/:groupId` - Get group payments
- `GET /api/payments/pending` - Get pending payments
- `POST /api/payments/:id/settle` - Settle payment

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

---

## 🧪 Testing

### Test Data

```javascript
// Register Test Account
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Test@123",
  "confirmPassword": "Test@123"
}

// Create Group
{
  "name": "Room Mates",
  "description": "Shared expenses",
  "members": ["userId1", "userId2"]
}

// Add Expense
{
  "description": "Dinner",
  "amount": 1500,
  "category": "Food",
  "splitType": "equal",
  "group": "groupId"
}
```

---

## 🐛 Troubleshooting

### Issue: Backend won't start
```bash
# Check port 5000
netstat -ano | findstr :5000

# Change port in .env if needed
```

### Issue: Cannot connect to MongoDB
```bash
# Verify MongoDB is running
mongod

# Or use MongoDB Atlas cloud connection
# Update MONGODB_URI in .env
```

### Issue: Frontend shows "API Error"
```bash
# Verify backend is running
# Check REACT_APP_API_URL in frontend/.env
# Restart frontend: npm start
```

### Issue: CORS errors
```bash
# Update FRONTEND_URL in backend/.env
# Restart backend server
```

---

## 📦 Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 18.2.0 |
| Styling | Tailwind CSS | 3.2.4 |
| Charts | Recharts | 2.5.0 |
| Backend | Express | 4.18.2 |
| Database | MongoDB | 7.0.0 |
| Authentication | JWT | 9.0.0 |
| Runtime | Node.js | 14+ |

---

## 📚 Documentation

- [Full README](./README.md) - Complete documentation
- [Backend Setup](./BACKEND_SETUP.md) - Detailed backend guide
- [Frontend Setup](./FRONTEND_SETUP.md) - Detailed frontend guide

---

## 🎓 Features to Explore

### For Users
1. **Register/Login** - Create account
2. **Create Groups** - Manage expense groups
3. **Track Expenses** - Add and categorize expenses
4. **Multiple Split Types** - Equal, custom, percentage
5. **Payment Tracking** - Monitor who owes whom
6. **Analytics** - View spending patterns

### For Developers
1. **JWT Authentication** - Secure token-based auth
2. **MongoDB Schemas** - Well-designed data models
3. **Express Middleware** - Error handling, validation
4. **React Hooks** - Modern React patterns
5. **Context API** - State management
6. **RESTful API** - Clean API design

---

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
# Build
cd frontend
npm run build

# Push to Vercel (with vercel CLI)
vercel
```

### Backend Deployment (Heroku)
```bash
# Create Heroku app
heroku create

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main
```

---

## 📞 Support & Issues

- Check the [README.md](./README.md) for detailed documentation
- Review [BACKEND_SETUP.md](./BACKEND_SETUP.md) for backend issues
- Check [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) for frontend issues
- Verify `.env` files are configured correctly
- Ensure MongoDB is running and accessible

---

## ✨ Key Features Implemented

✅ Full-stack MERN architecture
✅ Modern, responsive UI with Tailwind CSS
✅ JWT-based authentication
✅ MongoDB with Mongoose ODM
✅ RESTful API with proper error handling
✅ Group-based expense management
✅ Multiple expense split options
✅ Payment tracking and settlement
✅ Analytics and reporting
✅ Real-time balance calculations
✅ Notification system ready
✅ Production-ready code structure

---

## 🎯 Next Steps

1. ✅ Start backend: `cd backend && npm run dev`
2. ✅ Start frontend: `cd frontend && npm start`
3. ✅ Register an account
4. ✅ Create a test group
5. ✅ Add expenses
6. ✅ Explore all features
7. ✅ Check analytics and reports

---

**Happy Expense Splitting! 🎉**

For detailed information, see the complete [README.md](./README.md)
