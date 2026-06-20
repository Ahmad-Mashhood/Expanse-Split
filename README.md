# Smart Expense Split & Reminder System

A professional, full-stack MERN application for managing shared expenses between friends, roommates, hostel students, and travel groups.

## 🎯 Features

### User Authentication
- User registration and login
- JWT-based authentication
- Password recovery functionality
- Secure session management

### Dashboard
- Total expenses overview
- Pending balances tracking
- Recent transactions display
- Monthly expense summary
- Expense analytics with charts

### Group Management
- Create and manage groups
- Add/remove group members
- Group-specific dashboards
- Shared expense tracking

### Expense Management
- Add, edit, and delete expenses
- Multiple split options (equal, custom, percentage)
- Receipt image uploads
- Expense history tracking
- Category-based organization

### Payment Tracking
- Mark payments as settled
- View pending payments
- Transaction history
- Automatic balance calculation

### Notifications & Analytics
- Payment reminders
- Group activity notifications
- Monthly spending reports
- Category-wise expense analysis
- Visual charts and graphs

## 🚀 Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email notifications

## 📁 Project Structure

```
DB project/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # React context
│   │   ├── styles/          # CSS files
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   ├── public/              # Static files
│   └── package.json
│
└── backend/
    ├── config/              # Configuration files
    ├── controllers/         # Business logic
    ├── models/              # MongoDB schemas
    ├── routes/              # API routes
    ├── middleware/          # Custom middleware
    ├── utils/               # Utility functions
    ├── server.js            # Express server
    └── package.json
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn package manager

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your configuration
# - Set MongoDB URI
# - Set JWT secret
# - Configure email settings

# Start the server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start the development server
npm start
```

The application will be available at `http://localhost:3000`

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Groups
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create new group
- `GET /api/groups/:id` - Get group details
- `POST /api/groups/:id/add-member` - Add member to group
- `POST /api/groups/:id/remove-member` - Remove member from group
- `DELETE /api/groups/:id` - Delete group

### Expenses
- `GET /api/expenses/:groupId` - Get group expenses
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Payments
- `GET /api/payments/:groupId` - Get group payments
- `GET /api/payments/pending` - Get pending payments
- `POST /api/payments/:id/settle` - Settle payment

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## 🎨 UI Features

- **Professional SaaS-style interface** with dark sidebar
- **Responsive design** for mobile, tablet, and desktop
- **Modern cards and tables** for data display
- **Interactive charts and graphs** for analytics
- **Clean typography** and professional color palette
- **Smooth animations** and transitions
- **Form validation** and error handling

## 📊 Database Schema

### Users Collection
- User profiles and authentication data
- Group memberships
- Password reset tokens

### Groups Collection
- Group information and metadata
- Member lists
- Associated expenses

### Expenses Collection
- Expense details and amounts
- Split information
- Category classification
- Receipt images

### Payments Collection
- Payment records
- Settlement status
- Amount tracking

### Notifications Collection
- User notifications
- Activity alerts
- Read/unread status

## 🔐 Security Features

- JWT-based authentication
- Bcrypt password hashing
- CORS configuration
- Input validation and sanitization
- Error handling middleware
- Secure file uploads

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the build folder
```

### Backend (Heroku/Railway/Render)
```bash
# Push to your hosting service
git push heroku main
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please create an issue in the repository.

---

**Built with ❤️ by Your Team**
