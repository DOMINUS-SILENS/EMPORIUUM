# E-Commerce Platform Integration Guide

This document provides an overview of the integration between the welcome-app, vendeur-app, and achteur-app in the E-Commerce Platform.

## Architecture Overview

The platform consists of three separate React applications:

1. **welcome-app** (Port 3000)
   - Entry point for all users
   - Handles authentication (login/register)
   - Redirects users to the appropriate app based on their role

2. **vendeur-app** (Port 3001)
   - Seller dashboard and management interface
   - Accessible only to users with 'vendeur' role

3. **acheteur-app** (Port 3002)
   - Buyer interface for browsing and purchasing products
   - Accessible only to users with 'acheteur' role

## Authentication Flow

1. **Registration**
   - User signs up via welcome-app
   - Selects role (vendeur or acheteur)
   - Account is created in the backend
   - User is automatically logged in and redirected to the appropriate app

2. **Login**
   - User logs in via welcome-app
   - Backend validates credentials and returns JWT token
   - User is redirected to the appropriate app based on their role

3. **Session Management**
   - JWT token is stored in localStorage
   - User role is also stored in localStorage for cross-app navigation
   - Token is automatically refreshed before expiration

## Implementation Details

### Backend (FastAPI)

- **User Model**: Includes role-based access control (vendeur/acheteur/admin)
- **Authentication**: JWT-based with role claims
- **Endpoints**:
  - `POST /auth/register` - Register new user
  - `POST /auth/login` - User login
  - `GET /auth/me` - Get current user data
  - `POST /auth/refresh-token` - Refresh access token

### Frontend (React)

#### Shared Components
- **AuthContext**: Manages authentication state and user data
- **API Client**: Handles all API requests with token management

#### welcome-app
- Handles login/registration
- Role-based redirection after authentication
- Shared layout and components

#### vendeur-app & achteur-app
- Protected routes based on user role
- Specific functionality for each user type

## Development Setup

### Prerequisites

- Node.js (v16+)
- Python (3.8+)
- PostgreSQL

### Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Set up environment variables (create `.env` file):
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
   SECRET_KEY=your-secret-key
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ```

3. Run database migrations:
   ```bash
   python -m src.db.create_tables
   ```

4. Start the backend server:
   ```bash
   uvicorn src.main:app --reload
   ```

### Frontend Setup

1. Install dependencies for each app:
   ```bash
   cd apps/welcome-app
   npm install
   
   cd ../vendeur-app
   npm install
   
   cd ../acheteur-app
   npm install
   ```

2. Start each app in a separate terminal:
   ```bash
   # Terminal 1
   cd apps/welcome-app
   npm run dev
   
   # Terminal 2
   cd apps/vendeur-app
   npm run dev -- --port 3001
   
   # Terminal 3
   cd apps/acheteur-app
   npm run dev -- --port 3002
   ```

## Testing the Integration

1. **Registration Flow**
   - Open http://localhost:3000/register
   - Fill in the registration form and select a role (vendeur or acheteur)
   - Verify redirection to the appropriate app after registration

2. **Login Flow**
   - Open http://localhost:3000/login
   - Enter your credentials
   - Verify redirection to the appropriate app based on your role

3. **Role-Based Access**
   - Try accessing vendeur-app (port 3001) with an acheteur account
   - Try accessing achteur-app (port 3002) with a vendeur account
   - Verify that access is restricted based on user role

## Troubleshooting

1. **CORS Issues**
   - Ensure all frontend URLs are whitelisted in the backend CORS middleware
   - Check that the backend is running and accessible

2. **Authentication Issues**
   - Verify that the JWT token is being sent with API requests
   - Check that the token is valid and not expired
   - Ensure the user's role is correctly set in the database

3. **Redirection Issues**
   - Verify that the app URLs in the frontend configuration match your setup
   - Check the browser's console for any errors

## Deployment

### Backend
- Deploy to a cloud provider (e.g., Heroku, AWS, GCP)
- Set up environment variables in production
- Configure database connection

### Frontend
- Build each app for production:
  ```bash
  cd apps/welcome-app
  npm run build
  
  cd ../vendeur-app
  npm run build
  
  cd ../acheteur-app
  npm run build
  ```
- Deploy the built files to a static file host (e.g., Vercel, Netlify, S3)
- Update the API base URL in each app's configuration

## Security Considerations

1. Always use HTTPS in production
2. Store sensitive information in environment variables
3. Implement rate limiting on authentication endpoints
4. Regularly update dependencies
5. Use secure cookie settings for production
6. Implement proper error handling to avoid leaking sensitive information
