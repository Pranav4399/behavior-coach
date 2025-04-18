# Behavioral Coach API

A Node.js backend API for the Behavioral Coach application built with Express, TypeScript, Prisma ORM, and PostgreSQL.

## Features

- RESTful API with Express
- TypeScript for type safety
- PostgreSQL database with Prisma ORM
- API documentation with Swagger/OpenAPI
- Environment variable management
- Error handling middleware
- Security features (helmet, rate limiting, etc.)

## Requirements

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the `.env.example` file to `.env` and update the variables:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` in the `.env` file to point to your PostgreSQL database.

### 4. Set up the database

Create a PostgreSQL database and run the migrations:

```bash
npm run db:migrate
```

Generate the Prisma client:

```bash
npm run db:generate
```

### 5. Start the development server

```bash
npm run dev
```

The server will start at http://localhost:3000. Visit http://localhost:3000/api-docs to view the API documentation.

## Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server
- `npm run lint` - Run TypeScript checks
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio to view and edit data
- `npm run db:seed` - Seed the database with initial data

## API Documentation

API documentation is available at `/api-docs` when the server is running. It's generated automatically from the Swagger/OpenAPI annotations in the code.

## Project Structure

```
backend/
├── prisma/             # Prisma schema and migrations
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Authentication

Authentication will be added in a future update. Currently, all endpoints are public.

## License

[MIT](LICENSE) 