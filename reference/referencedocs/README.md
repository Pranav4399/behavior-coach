# Behavioral Coaching Platform - Reference Documentation Overview

This README provides a summary and index of the reference documentation contained within this directory. These documents collectively describe the purpose, architecture, data model, development practices, and plans for the ABCD Behavioral Coaching Platform.

## Directory Contents

This directory contains the following key reference documents:

1.  **`Product Overview.md`**: Details the platform's purpose, target audience (NGOs, social enterprises), core features (audience management, segmentation, journeys, programs, experiments, marketplace), user roles (Client Org Admin, Training Manager, Program Manager; Expert Org Admin, Content Specialist; ABCD Admin), multi-tenant SaaS structure (subscription tiers, resource tracking), and overall strategic value.
2.  **`Architecture.md`**: Outlines the technical architecture, including the modular monolith approach, domain-driven design (DDD) implementation, use of Clean Architecture / Hexagonal principles, multi-tenant strategy, technology stack (Next.js, Node.js, TypeScript, Prisma, PostgreSQL, etc.), integration patterns (WhatsApp, internal events), scalability considerations, security model, and environment management strategy.
3.  **`ERD.md`**: Provides a detailed Entity Relationship Diagram (ERD) and sample database schemas (PostgreSQL) for key entities like Organizations, Users, Workers, Segments, Content, JourneyBlueprints, Programs, Experiments, and their relationships, emphasizing multi-tenancy and data isolation.
4.  **`Repo.md`**: Describes the backend/monolith repository structure (`behavioral-coaching-platform/`), emphasizing domain-driven organization (`src/domains/`), clean architecture separation, API-first design, contract testing, configuration management, and CI/CD pipeline integration for environment parity and validation. Includes detailed folder breakdowns for configuration, libraries, middleware, utilities, and specific domains.
5.  **`API & Pages.md`**: Maps core frontend pages/interactions (Authentication, Org Management, Worker Management, Segmentation, Content/Journeys, Programs, Experiments, Gamification, Marketplace) to proposed backend REST API endpoints, providing an initial synchronization point for frontend and backend development.
6.  **`frontend-repo.md`**: Details the specific repository structure for the frontend build (`abcd-frontend-build/`), utilizing the Next.js App Router, feature-first organization (`src/app/(app)/`, `src/components/features/`, `src/hooks/features/`), path aliases, component patterns, and includes a breakdown matching the pages defined in `API & Pages.md` plus additions like Wellbeing, Projects/Funders, and Notifications.
7.  **`development-patterns.md`**: Specifies frontend development conventions, including folder/file structure, component development rules (TypeScript, props interfaces, structure, memoization, A11y), state management guidelines (local vs. global, react-query/SWR, react-hook-form), styling approaches (UI library, Tailwind, CSS Modules), TypeScript best practices (strict mode, avoid `any`), API interaction patterns, custom hook usage, code style, testing practices (React Testing Library), and Next.js specifics (Server/Client Components, `next/image`).
8.  **`development-plan.md`**: Outlines a phased frontend development plan, breaking down the implementation into logical steps from project setup and documentation through core UI, authentication, domain features (Workers, Segments, Content, Journeys, Programs, Wellbeing, Projects, Experiments, Gamification, Analytics, Marketplace, Admin), integration, polish, and testing.
9.  **`design-patterns.md`**: Documents visual design patterns observed in the existing `src` directory to ensure consistency. Covers the UI library (MUI), theming (`createTheme`), color palette, typography (including custom fonts and variants), layout/spacing standards, component styling approaches (`sx` prop, wrapper components, CSS Modules), iconography (Material Icons), and recommends best practices for applying these patterns in the new frontend.
10. **`apis-enhanced.md`**: Provides a significantly expanded and more detailed specification of backend API endpoints compared to `API & Pages.md`. It covers all identified functional areas with more granular endpoints for CRUD operations, actions, configuration, state management, reporting, and administration across all domains (Auth, Organizations, Users, Workers, Segments, Content, Journeys, Programs, Experiments, Gamification, Wellbeing, Marketplace, Analytics, Projects/Funders, Notifications, Admin).

## Key Concepts Summary

*   **Platform Goal**: A multi-tenant SaaS platform for development organizations to manage, deliver, and optimize behavioral coaching for frontline audiences (workers) using structured Journeys deployed via Programs.
*   **Architecture**: Modular Monolith using DDD and Clean Architecture principles. Backend primarily Node.js/TypeScript/Prisma/PostgreSQL. Frontend Next.js (App Router)/TypeScript/React Query/MUI (or similar).
*   **Core Features**:
    *   **Audience Management**: Worker profiles, custom fields.
    *   **Segmentation**: Dynamic and static grouping of workers.
    *   **Content**: Reusable modules (text, media, quizzes).
    *   **Journey Blueprints**: Reusable templates defining sequences of content and logic.
    *   **Programs**: Operational deployment of Journeys to specific Segments with scheduling and tracking.
    *   **Experimentation**: A/B testing for content (Journey-level) and implementation (Program-level).
    *   **Wellbeing**: Tracking worker wellbeing indicators and providing support.
    *   **Projects/Funders**: Aligning programs with organizational projects and funding sources for reporting.
    *   **Gamification**: Badges, challenges, leaderboards.
    *   **Marketplace**: Optional sharing/acquisition of content/journeys between organizations.
*   **Development Principles**: Feature-first organization, strict TypeScript, use of established libraries (React Query, React Hook Form), component memoization, clear separation of concerns, comprehensive documentation, automated testing, adherence to defined design patterns.
*   **API Design**: RESTful, versioned, tenant-scoped, role-based authorization, standardized request/response/error formats.

This collection of documents serves as the primary reference for understanding and developing the Behavioral Coaching Platform. Please refer to the individual files for detailed information on specific topics. 