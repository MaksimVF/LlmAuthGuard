# Authentication Service

## Overview

This is a Node.js/Express authentication service built with TypeScript that provides user registration, login, and JWT-based authentication capabilities. The service is designed as a secure, production-ready authentication microservice with comprehensive security features and proper error handling.

**Current Status**: ✅ Fully functional microservice running on port 5000 with all endpoints tested and working correctly.

## System Architecture

### Backend Architecture
- **Framework**: Express.js with TypeScript for type safety
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **Password Security**: Argon2 hashing algorithm for password storage
- **Database**: Prisma ORM with support for multiple databases (currently configured with potential for PostgreSQL)
- **Security**: Comprehensive middleware stack including Helmet, CORS, rate limiting, and compression

### Key Design Decisions
- **JWT in HTTP-only cookies**: Chosen over local storage to prevent XSS attacks
- **Argon2 password hashing**: Selected for superior security over bcrypt
- **Prisma ORM**: Provides type safety and database abstraction
- **Comprehensive validation**: Server-side validation using express-validator
- **Graceful error handling**: Centralized error handling with proper HTTP status codes

## Key Components

### Authentication Layer
- **JWT Service**: Token generation, validation, and refresh mechanisms
- **Password Service**: Secure password hashing and verification using Argon2
- **Cookie Management**: HTTP-only cookie configuration for secure token storage

### Data Layer
- **Prisma Client**: Database abstraction layer with connection pooling
- **User Service**: CRUD operations for user management
- **Database Configuration**: Connection management with graceful shutdown

### Security Middleware
- **Helmet**: Security headers configuration
- **CORS**: Cross-origin resource sharing with configurable origins
- **Rate Limiting**: IP-based request limiting to prevent abuse
- **Input Validation**: Comprehensive validation using express-validator

### Route Structure
- **Auth Routes** (`/auth`): Registration, login, logout, and profile endpoints
- **Health Check** (`/health`): Service health monitoring endpoint

## Data Flow

### User Registration
1. Client sends registration request with email/password
2. Server validates input using express-validator
3. Password is hashed using Argon2
4. User data is stored in database via Prisma
5. JWT token is generated and sent as HTTP-only cookie

### User Authentication
1. Client sends login credentials
2. Server validates credentials against database
3. Password verification using Argon2
4. JWT token generated and sent as HTTP-only cookie
5. Subsequent requests authenticated via middleware

### Request Authentication
1. Middleware extracts JWT from HTTP-only cookie
2. Token is validated and decoded
3. User information is attached to request object
4. Protected routes can access authenticated user data

## External Dependencies

### Core Dependencies
- **Express**: Web framework for API endpoints
- **Prisma**: Database ORM and migration tool
- **JWT**: Token-based authentication
- **Argon2**: Password hashing library
- **Express-validator**: Input validation middleware

### Security Dependencies
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Express-rate-limit**: Request rate limiting
- **Cookie-parser**: HTTP cookie parsing

### Development Dependencies
- **TypeScript**: Static type checking
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Nodemon**: Development server with hot reload

## Deployment Strategy

### Environment Configuration
- **JWT_SECRET**: Must be set for production (minimum 32 characters)
- **DATABASE_URL**: Database connection string
- **ALLOWED_ORIGINS**: Comma-separated list of allowed CORS origins
- **NODE_ENV**: Environment setting (development/production)

### Production Considerations
- HTTPS enforcement for secure cookie transmission
- Database connection pooling and optimization
- Proper logging and monitoring setup
- Health check endpoints for load balancer integration

### Container Deployment
- Port configuration: Default 8000, configurable via PORT environment variable
- Host binding: 0.0.0.0 for container compatibility
- Graceful shutdown handling for SIGTERM/SIGINT signals

## Changelog

```
Changelog:
- July 08, 2025. Initial setup
- July 08, 2025. Created complete TypeScript authentication microservice with:
  - Express.js 4.x server with proper TypeScript configuration
  - Prisma ORM with PostgreSQL database integration
  - JWT authentication with HTTP-only cookies
  - Argon2 password hashing
  - Role-based access control (USER/ADMIN)
  - Complete API endpoints: /auth/register, /auth/login, /auth/logout, /auth/me
  - Security middleware (helmet, CORS, rate limiting)
  - Input validation and comprehensive error handling
  - Docker containerization ready
  - Health check endpoint for monitoring
  - Complete documentation and README
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Language: Russian - user communicates in Russian
```