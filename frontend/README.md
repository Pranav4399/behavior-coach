# Behavior Coach Frontend

This is the frontend application for the Behavior Coach platform. It's built with Next.js, TypeScript, Tailwind CSS, Redux, and React Query.

## Technologies Used

- **Next.js**: React framework with App Router
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling
- **Redux Toolkit**: For global state management
- **React Query**: For data fetching and cache management
- **Zod**: For form validation
- **Shadcn/UI**: Component library based on Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory

```bash
cd frontend
```

3. Install dependencies

```bash
npm install
# or
yarn install
```

4. Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

The project follows a feature-based organization as outlined in the reference documents.

```
frontend/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router directory
│   │   ├── (app)/      # Protected application routes
│   │   ├── (auth)/     # Authentication routes
│   │   └── api/        # API routes for Backend For Frontend patterns
│   ├── components/     # Reusable components
│   │   ├── ui/         # Base UI components
│   │   └── features/   # Feature-specific components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions, API clients, types
│   │   ├── api/        # API client configuration 
│   │   ├── utils.ts    # Utility functions
│   │   └── types/      # TypeScript type definitions
│   ├── store/          # Redux store configuration
│   └── styles/         # Global styles and theming
└── ...                 # Configuration files
```

## Features

- **Authentication**: Login, registration, password reset
- **Organization Management**: Create, update, and delete organizations
- **User Management**: Manage users within an organization
- **Dashboard**: Overview of key metrics and recent activity
- **Settings**: Configure organization and user settings

## Contributing

1. Follow the established patterns for components, hooks, and state management
2. Use TypeScript for all new code
3. Write tests for critical functionality
4. Keep components small and focused on a single responsibility

## License

This project is licensed under the terms of our proprietary license. 