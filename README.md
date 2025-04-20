# Behavior Coach

A full-stack application for behavioral coaching with a Next.js frontend and Express/Node.js backend.

## Overview

Behavior Coach is a platform designed to help organizations track and improve behaviors through coaching and analytics. It features a role-based access system, organization management, and a modern UI.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **State Management**: Redux Toolkit
- **Data Fetching**: Axios, React Query
- **UI Components**: Custom components with Radix UI
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **TypeScript**: For type safety

### Backend
- **Framework**: Express.js with Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth
- **API Documentation**: Swagger
- **TypeScript**: For type safety

## Project Structure

```
behavior-coach/
├── frontend/             # Next.js frontend application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── lib/          # Utilities and libraries
│   │   ├── store/        # Redux store
│   │   └── app/          # Next.js app router
│   ├── public/           # Static assets
│   └── ...config files
│
├── backend/              # Express backend application
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   └── utils/        # Utility functions
│   ├── prisma/           # Database schema and migrations
│   └── ...config files
└── ...
```

## Setup and Installation

### Prerequisites
- Node.js v18+ and npm
- PostgreSQL database

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables by copying `.env.example` to `.env` and updating the values:
   ```
   cp .env.example .env
   ```

4. Set up the database:
   ```
   npx prisma migrate dev
   ```

5. Start the development server:
   ```
   npm run dev
   ```

The backend API will be available at `http://localhost:3000/api`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables by copying `.env.example` to `.env.local` and updating the values:
   ```
   cp .env.example .env.local
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at `http://localhost:3001`.

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/signup`: User registration
- `GET /api/auth/me`: Get current user profile

### Organizations
- `GET /api/organizations`: List organizations
- `POST /api/organizations`: Create organization
- `GET /api/organizations/:id`: Get organization details
- `PUT /api/organizations/:id`: Update organization
- `DELETE /api/organizations/:id`: Delete organization

## Available Scripts

### Backend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run tests

### Frontend
- `npm run dev`: Start development server on port 3001
- `npm run build`: Build for production
- `npm run start`: Start production server on port 3001
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Environment Variables

### Backend
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: JWT token expiration

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_API_TIMEOUT`: API request timeout
- `PORT`: Frontend server port (default: 3001)

## Development Workflow

1. Start both frontend and backend servers
2. Make changes to the codebase
3. Use ESLint and Prettier to maintain code quality
4. Test API endpoints with Swagger UI at `http://localhost:3000/api-docs`
5. Commit changes following conventional commits

## License

[MIT](LICENSE) 