# Wellness Application Backend

A Node.js/Express REST API backend with role-based authentication for a healthcare wellness application supporting patients and healthcare providers.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [Database Models](#database-models)
- [Error Handling](#error-handling)

## Features

- **Role-Based Authentication** - Separate user roles for patients and healthcare providers
- **JWT-based Authentication** - Secure session management with JSON Web Tokens
- **Password Security** - Bcrypt hashing with salt rounds
- **Patient Dashboard** - Goal tracking and wellness management for patients
- **Provider Dashboard** - Patient management and provider profile
- **Profile Management** - Role-specific profile fields and updates
- **RESTful API** - Clean, organized API endpoints
- **MongoDB Integration** - NoSQL database with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv
- **CORS**: cors

## Project Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── models/
│   ├── User.js                  # User model (patients & providers)
│   └── Goal.js                  # Goal model (patient wellness goals)
├── middleware/
│   └── authMiddleware.js        # JWT authentication & role-based authorization
├── routes/
│   ├── authRoutes.js           # Authentication routes
│   └── dataRoutes.js           # Protected data routes
├── controllers/
│   ├── authController.js       # Authentication logic
│   └── dataController.js       # Business logic for data operations
├── server.js                    # Application entry point
├── .env                         # Environment variables (not in repo)
└── package.json                 # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   touch .env
   ```

4. **Add environment variables** (see [Environment Variables](#environment-variables))

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will run on `http://localhost:5000` (or your configured PORT)

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/wellness-app
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/wellness-app

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d
```

**Security Note**:
- Never commit `.env` to version control
- Use strong, unique `JWT_SECRET` in production
- Change default values before deployment

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

# Patient Registration
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}

# Provider Registration
{
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "provider",
  "specialization": "Cardiology",
  "licenseNumber": "MD12345",
  "yearsOfExperience": 10,
  "bio": "Experienced cardiologist specializing in preventive care"
}

# Response (201 Created)
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "patient",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

# Response (200 OK)
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "patient",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

# Response (200 OK) - Patient
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "patient",
  "age": 35,
  "gender": "male",
  "healthConditions": ["diabetes", "hypertension"],
  "profileComplete": true
}

# Response (200 OK) - Provider
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "role": "provider",
  "specialization": "Cardiology",
  "licenseNumber": "MD12345",
  "yearsOfExperience": 10,
  "bio": "Experienced cardiologist...",
  "profileComplete": true
}
```

### Profile Endpoints

#### Get Profile
```http
GET /api/data/profile
Authorization: Bearer <token>

# Response: Same as /api/auth/me
```

#### Update Profile
```http
PUT /api/data/profile
Authorization: Bearer <token>
Content-Type: application/json

# Patient Profile Update
{
  "name": "John Updated",
  "age": 36,
  "gender": "male",
  "healthConditions": ["diabetes"]
}

# Provider Profile Update
{
  "name": "Dr. Jane Smith",
  "specialization": "Cardiology & Heart Health",
  "yearsOfExperience": 12,
  "bio": "Updated bio..."
}
```

### Goal Endpoints (Patient Only)

#### Get All Goals
```http
GET /api/data/goals
Authorization: Bearer <patient_token>

# Response (200 OK)
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "user": "507f1f77bcf86cd799439011",
    "title": "Walk 10,000 steps daily",
    "description": "Improve cardiovascular health",
    "category": "fitness",
    "targetValue": 10000,
    "currentValue": 7500,
    "unit": "steps",
    "status": "active",
    "progress": 75,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
]
```

#### Create Goal
```http
POST /api/data/goals
Authorization: Bearer <patient_token>
Content-Type: application/json

{
  "title": "Drink 8 glasses of water daily",
  "description": "Stay hydrated for better health",
  "category": "nutrition",
  "targetValue": 8,
  "unit": "glasses",
  "endDate": "2025-12-31"
}

# Response (201 Created)
{
  "_id": "507f1f77bcf86cd799439014",
  "user": "507f1f77bcf86cd799439011",
  "title": "Drink 8 glasses of water daily",
  "category": "nutrition",
  "targetValue": 8,
  "currentValue": 0,
  "unit": "glasses",
  "status": "active",
  "progress": 0,
  ...
}
```

#### Update Goal
```http
PUT /api/data/goals/:id
Authorization: Bearer <patient_token>
Content-Type: application/json

{
  "currentValue": 6,
  "status": "active"
}

# Response (200 OK)
{
  "_id": "507f1f77bcf86cd799439014",
  "currentValue": 6,
  "progress": 75,
  ...
}
```

#### Delete Goal
```http
DELETE /api/data/goals/:id
Authorization: Bearer <patient_token>

# Response (200 OK)
{
  "message": "Goal removed"
}
```

### Provider Endpoints

#### Get All Providers
```http
GET /api/data/providers
Authorization: Bearer <token>

# Response (200 OK)
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Dr. Jane Smith",
    "email": "jane@example.com",
    "role": "provider",
    "specialization": "Cardiology",
    "licenseNumber": "MD12345",
    "yearsOfExperience": 10,
    "bio": "Experienced cardiologist...",
    "profileComplete": true,
    "createdAt": "2025-01-10T08:00:00.000Z"
  }
]
```

#### Get Provider by ID
```http
GET /api/data/providers/:id
Authorization: Bearer <token>

# Response (200 OK)
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "role": "provider",
  "specialization": "Cardiology",
  ...
}
```

## Authentication & Authorization

### JWT Token Flow

1. **User Registration/Login** → Server generates JWT token
2. **Client stores token** (localStorage, cookies, etc.)
3. **Client sends token** in Authorization header: `Bearer <token>`
4. **Server verifies token** and extracts user information
5. **Request processed** with authenticated user context

### Middleware Chain

```javascript
// Authentication only
router.get('/profile', protect, getProfile);

// Authentication + Role Authorization
router.post('/goals', protect, restrictTo('patient'), createGoal);
```

### Role-Based Access Control

| Endpoint | Patient | Provider |
|----------|---------|----------|
| GET /api/auth/me | ✅ | ✅ |
| GET /api/data/profile | ✅ | ✅ |
| PUT /api/data/profile | ✅ | ✅ |
| GET /api/data/goals | ✅ | ❌ |
| POST /api/data/goals | ✅ | ❌ |
| PUT /api/data/goals/:id | ✅ | ❌ |
| DELETE /api/data/goals/:id | ✅ | ❌ |
| GET /api/data/providers | ✅ | ✅ |
| GET /api/data/providers/:id | ✅ | ✅ |

## Database Models

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['patient', 'provider'], required),

  // Patient-specific fields
  age: Number,
  gender: String (enum: ['male', 'female', 'other']),
  healthConditions: [String],

  // Provider-specific fields
  specialization: String,
  licenseNumber: String,
  yearsOfExperience: Number,
  bio: String,

  profileComplete: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Goal Model

```javascript
{
  user: ObjectId (ref: 'User', required),
  title: String (required),
  description: String,
  category: String (enum: ['fitness', 'nutrition', 'mental_health', 'sleep', 'other']),
  targetValue: Number,
  currentValue: Number,
  unit: String,
  startDate: Date,
  endDate: Date,
  status: String (enum: ['active', 'completed', 'paused', 'abandoned']),
  progress: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format

```json
{
  "message": "Error description"
}
```

### Common Errors

```json
// Invalid credentials
{
  "message": "Invalid email or password"
}

// Missing token
{
  "message": "Not authorized, no token"
}

// Invalid role access
{
  "message": "You do not have permission to perform this action"
}

// Validation error
{
  "message": "Please provide all required fields"
}
```

## Security Features

1. **Password Hashing** - Bcrypt with salt rounds (pre-save hook)
2. **JWT Tokens** - Stateless authentication with 30-day expiration
3. **Password Exclusion** - Password field excluded from queries by default
4. **Role-Based Access** - Route-level authorization middleware
5. **Input Validation** - Mongoose schema validation
6. **CORS Protection** - Cross-origin resource sharing configuration
7. **Resource Authorization** - Users can only access their own resources

## Development

### Adding New Routes

1. Create controller function in `controllers/`
2. Add route in `routes/`
3. Apply appropriate middleware (`protect`, `restrictTo`)

Example:
```javascript
// controllers/dataController.js
const newFeature = async (req, res) => {
  // Implementation
};

// routes/dataRoutes.js
router.get('/new-feature', protect, restrictTo('patient'), newFeature);
```

### Testing with Postman/Thunder Client

1. Register a user to get a token
2. Add token to Authorization header: `Bearer <token>`
3. Make requests to protected endpoints

## License

ISC

## Author

HCLTech Wellness Team

---

**Note**: This is a backend API. For frontend integration, ensure you handle token storage securely and include the Authorization header in all protected requests.
