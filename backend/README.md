# Smart Expense Split Backend

Backend server for the Smart Expense Split & Reminder System application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- MongoDB connection URI
- JWT secret key
- Email configuration for notifications
- Frontend URL

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Documentation

See the main README.md in the project root for full API documentation.

## Folder Structure

- `config/` - Database and configuration files
- `controllers/` - Business logic for each feature
- `models/` - MongoDB schemas
- `routes/` - API endpoint definitions
- `middleware/` - Custom middleware (auth, validation, etc.)
- `utils/` - Helper functions

## Environment Variables

Required environment variables:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Frontend application URL
- `NODE_ENV` - Environment (development/production)
