# Smart Expense Split Frontend

React frontend for the Smart Expense Split & Reminder System application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

3. Start the development server:
```bash
npm start
```

Application will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Project Structure

- `components/` - Reusable React components
- `pages/` - Page components for different routes
- `services/` - API service calls
- `context/` - React Context for state management
- `styles/` - CSS and styling files
- `public/` - Static files

## Features

- User authentication (register/login)
- Dashboard with expense overview
- Group management
- Expense tracking with multiple split options
- Payment tracking and settlement
- Analytics and reports
- Responsive design for all devices

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (one-way operation)
