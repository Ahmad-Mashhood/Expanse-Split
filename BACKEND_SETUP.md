# Backend Setup Instructions

## Prerequisites
- Node.js v14 or higher
- MongoDB running locally or connection string for MongoDB Atlas
- npm or yarn

## Installation Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   Open `.env` and update:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A strong secret key (e.g., generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `PORT` - Server port (default: 5000)
   - `FRONTEND_URL` - Frontend URL for CORS (http://localhost:3000)
   - Email settings for notifications (optional)

5. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Server will start on `http://localhost:5000`

## MongoDB Setup

### Option 1: Local MongoDB
```bash
# Install MongoDB Community Edition
# Run MongoDB service
mongod
```

### Option 2: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env`

## Testing the Backend

Use Postman or cURL to test endpoints:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check `MONGODB_URI` is correct
- Verify network access if using MongoDB Atlas

### Port Already in Use
```bash
# Change PORT in .env or kill process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### JWT Issues
- Regenerate JWT_SECRET in .env
- Clear tokens in browser localStorage

## Next Steps

1. Start frontend server (see frontend README)
2. Navigate to http://localhost:3000
3. Register a new account
4. Start creating groups and managing expenses
