# S.M.O Backend API

A comprehensive backend for Smart Money Operations - a financial management application built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Transaction management (income, expense, transfers)
- Recipient management with favorites
- Subscription tracking
- Smart alerts system
- Data validation and security
- Rate limiting
- Comprehensive error handling

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Configure Environment Variables

Create a `.env` file in the backend directory with:

\`\`\`
MONGODB_URI=mongodb+srv://bellarinseth_db_user:vUqEFC9zzhSA4ltU@cluster0.r4in9vg.mongodb.net/smo_db?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
\`\`\`

### 3. Start the Server

Development mode with auto-reload:
\`\`\`bash
npm run dev
\`\`\`

Production mode:
\`\`\`bash
npm start
\`\`\`

The server will run on http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile (requires auth)
- PUT /api/auth/profile - Update user profile (requires auth)

### Transactions
- POST /api/transactions - Create transaction
- GET /api/transactions - Get user transactions
- GET /api/transactions/:id - Get transaction by ID
- PUT /api/transactions/:id - Update transaction
- DELETE /api/transactions/:id - Delete transaction

### Recipients
- POST /api/recipients - Create recipient
- GET /api/recipients - Get user recipients
- GET /api/recipients/:id - Get recipient by ID
- PUT /api/recipients/:id - Update recipient
- PUT /api/recipients/:id/favorite - Toggle favorite
- DELETE /api/recipients/:id - Delete recipient

### Subscriptions
- POST /api/subscriptions - Create subscription
- GET /api/subscriptions - Get user subscriptions
- GET /api/subscriptions/:id - Get subscription by ID
- PUT /api/subscriptions/:id - Update subscription
- DELETE /api/subscriptions/:id - Delete subscription

### Alerts
- POST /api/alerts - Create alert
- GET /api/alerts - Get user alerts
- GET /api/alerts/:id - Get alert by ID
- PUT /api/alerts/:id/read - Mark alert as read
- PUT /api/alerts/read-all - Mark all alerts as read
- DELETE /api/alerts/:id - Delete alert

### Health Check
- GET /api/health - Check server status

## Project Structure

\`\`\`
backend/
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Transaction.js
│   ├── Recipient.js
│   ├── Subscription.js
│   └── Alert.js
├── controllers/         # Business logic
│   ├── authController.js
│   ├── transactionController.js
│   ├── recipientController.js
│   ├── subscriptionController.js
│   └── alertController.js
├── routes/             # API routes
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── transaction.routes.js
│   ├── recipient.routes.js
│   ├── subscription.routes.js
│   └── alert.routes.js
├── middleware/         # Express middleware
│   ├── auth.js
│   ├── errorHandler.js
│   ├── requestLogger.js
│   ├── validation.js
│   └── rateLimit.js
├── validators/         # Data validation schemas
│   └── schemas.js
├── server.js          # Main application file
├── .env               # Environment variables
└── package.json       # Dependencies
\`\`\`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## Error Handling

All errors return a consistent JSON format:

\`\`\`json
{
  "success": false,
  "status": 400,
  "message": "Error description",
  "details": []
}
\`\`\`

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Rate limiting on all routes
- Input validation with Joi
- CORS enabled for frontend communication
- Request logging for debugging

## Database Collections

The MongoDB database includes the following collections:

- **users** - User accounts and profiles
- **transactions** - Financial transactions
- **recipients** - Payment recipients and contacts
- **subscriptions** - Recurring subscription tracking
- **alerts** - User alerts and notifications

## Notes

- Change JWT_SECRET in production to a secure random string
- Update CORS_ORIGIN with your frontend URL
- Ensure MongoDB connection string is correct
- All timestamps are stored in UTC
