# Frontend Setup Instructions

## Prerequisites
- Node.js v14 or higher
- npm or yarn
- Backend server running on http://localhost:5000

## Installation Steps

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
   ```
   
   Or create `.env` file manually with:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm start
   ```
   
   Application will automatically open at `http://localhost:3000`

## Available Pages

- `/` - Landing page (public)
- `/register` - User registration
- `/login` - User login
- `/dashboard` - Main dashboard (protected)
- `/group/:groupId` - Group details (protected)
- `/payments` - Payment management (protected)
- `/reports` - Analytics and reports (protected)

## Building for Production

```bash
# Build optimized production bundle
npm run build

# The build folder is ready to be deployed
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | http://localhost:5000/api |

## Troubleshooting

### Backend not found error
- Ensure backend server is running on http://localhost:5000
- Check `REACT_APP_API_URL` in `.env` file
- Clear browser cache and restart development server

### Port 3000 already in use
```bash
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### Dependencies installation issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS error
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Restart backend server after changing .env

## Features to Try

1. **Create Account** - Register with email and password
2. **Create Group** - Create expense groups with friends
3. **Add Expenses** - Add shared expenses with multiple split options
4. **Track Payments** - Monitor and settle pending payments
5. **View Analytics** - See expense breakdowns and reports

## Next Steps

1. Register a new account
2. Create a test group
3. Add some expenses
4. Check the dashboard and reports
5. Settle payments to see the system in action

## Development Tips

- Use React DevTools browser extension for debugging
- Check browser console for API errors
- Use browser Network tab to inspect API calls
- Login credentials are stored in localStorage
