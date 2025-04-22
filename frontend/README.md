# Behavior Coach Frontend

A modern web application built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **UI Framework**: Next.js (App Router) - For routing, layout, and server components
- **Styling**: Tailwind CSS + shadcn/ui - Utility-first CSS with accessible UI components
- **Components**: Radix UI (via shadcn) - Accessible, unstyled components
- **State Management**: Zustand - Simple, scalable state management
- **Forms**: React Hook Form - Light, performant form handling with Zod validation
- **API Layer**: React Query - For data fetching, caching, and state management
- **Language**: TypeScript - For type-safe development
- **Testing**: Jest + React Testing Library - For unit and UI testing

## Project Structure

```
src/
├── app/            # App router pages and layouts
│   ├── api/        # API routes (if needed)
│   └── ...         # Page routes
├── components/     # Reusable UI components
│   ├── ui/         # Basic UI components (shadcn)
│   └── ...         # Custom components
├── features/       # Feature-based components
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries
│   ├── api/        # API-related utilities
│   └── utils.ts    # General utilities
├── store/          # Zustand stores
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Available Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
