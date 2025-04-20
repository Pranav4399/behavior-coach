# ABCD Behavior Coach - Frontend Development Patterns

This document outlines the key development patterns and conventions to follow when building the ABCD Behavior Coach frontend. Adhering to these patterns ensures consistency, maintainability, and alignment with project standards.

## 1. Folder Structure & Organization

*   **App Router:** Utilize the Next.js App Router (`src/app/`) for routing, layouts, loading states, and error handling.
*   **Feature-First Grouping:** Organize components, hooks, utils, and potentially styles within feature-specific directories (e.g., `src/components/features/workers/`, `src/hooks/features/useWorkersApi.ts`). (Rule 1.3)
*   **Directory Naming:** Use `kebab-case` for directories.
*   **File Naming:**
    *   React Components: `PascalCase.tsx` (e.g., `WorkerList.tsx`). (Rule 1.5)
    *   Hooks: `useCamelCase.ts` (e.g., `useWorkersApi.ts`). (Rule 3.1)
    *   Utilities/Services: `camelCase.ts` or `PascalCase.ts` for classes. (Rule 1.5)
    *   Styling (CSS Modules): `camelCase.module.css` or `kebab-case.module.css`. (Rule 1.5)
    *   Pages (App Router): `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.
*   **Path Aliases:** **Always** use defined path aliases (e.g., `@/components/*`, `@/hooks/*`, `@/lib/*`) for imports outside the current feature directory. Avoid relative paths (`../`) for cross-feature imports. (Rule 1.4)
*   **File Size Limit:** Keep files concise, ideally under 400 lines. Break down large components or logic into smaller, reusable pieces. (Rule 1.1)

## 2. Component Development

*   **Functional Components:** Use functional components with React Hooks.
*   **TypeScript:** Write all components in TypeScript (`.tsx`).
*   **Props Interface:** Define explicit `interface` or `type` for component props, suffixing with `Props` (e.g., `WorkerCardProps`). Use JSDoc comments for props. (Rule 3.2, Rule 9.1)
    *   Avoid `any` type for props. Be specific. Use `React.ReactNode` for children or renderable elements if appropriate.
*   **Structure:** Follow a consistent structure:
    1.  Imports (React, libraries, components, hooks, types, styles)
    2.  Type/Interface definitions (Props, local state if complex)
    3.  Component function definition (`React.FC<PropsType>` or `const Comp: React.FC<PropsType> = (...) =>`)
    4.  Hook calls (`useState`, `useEffect`, `useContext`, custom hooks)
    5.  Memoized callbacks/values (`useCallback`, `useMemo`)
    6.  Helper functions specific to the component (if simple)
    7.  `return` statement (JSX)
    8.  `export default ComponentName;`
*   **Destructuring:** Use object and array destructuring for props and hook return values. (Rule 2.4)
*   **Memoization:** Use `React.memo` for components that might re-render unnecessarily. Use `useCallback` for event handlers passed as props and `useMemo` for expensive calculations. (Rule 3.3)
*   **Early Returns:** Use early returns to reduce nesting and improve readability. (Rule 2.6)
*   **JSX:**
    *   Keep JSX clean and readable. Extract complex conditional rendering logic into variables or helper functions if needed.
    *   Use fragments (`<>...</>`) when a wrapper element isn't necessary.
    *   Use `className` for styling (see Styling section).
    *   Always provide `key` props for lists.
*   **Accessibility (A11y):**
    *   Use semantic HTML elements where appropriate (`<nav>`, `<main>`, `<button>`, etc.).
    *   Ensure interactive elements are keyboard navigable and focusable.
    *   Provide `alt` text for images (`next/image`).
    *   Use `aria-*` attributes where necessary to improve screen reader support. (Rule 11.1)
    *   Maintain sufficient color contrast (Rule 11.4).

## 3. State Management

*   **Local vs. Global:** Use local component state (`useState`, `useReducer`) for component-specific concerns. Use global state *only* for app-wide concerns like authentication status or user profile. (Rule 4.1)
*   **Global State:**
    *   Prefer specialized state management libraries like Zustand or Jotai over rolling your own large Context + Reducer setup for simplicity, performance, and type safety.
    *   If using Context, keep it minimal and focused (e.g., `AuthContext`, `TenantContext`). Avoid putting all global state into one giant context.
*   **API/Server State:** Use `react-query` or `SWR` for managing server state (fetching, caching, optimistic updates, background refresh). **Do not** store API responses directly in global Context or local `useState` unless necessary for temporary UI interaction state. (Rule 4.5)
*   **Form State:** Use `react-hook-form` for managing form state, validation, and submission, especially for complex forms. Integrate with a schema validation library like `zod`. (Rule 4.3, Rule 8.2)
*   **State Initialization:** Always initialize state with sensible defaults to avoid undefined errors. (Rule 4.2)
*   **Immutability:** Treat state as immutable. When updating state based on previous state, use the functional update form (e.g., `setCount(c => c + 1)`). (Rule 2.3)

## 4. Styling

*   **UI Library:** Primarily use components from the chosen UI library (e.g., Material UI, Shadcn/ui, Mantine). Customize appearance via the library's theming system or utility props (`sx` for MUI, utility classes for Tailwind-based libraries).
*   **Tailwind CSS (Recommended if using Shadcn/ui):** If using a Tailwind-based library, leverage utility classes directly in the JSX for most styling needs. Keep custom CSS minimal.
*   **CSS Modules:** For component-specific custom styles that go beyond the UI library or Tailwind utilities, use CSS Modules (`*.module.css` or `*.module.scss`). Import `styles` and apply classes (`className={styles.myClass}`). (Rule 1.5)
*   **Global Styles:** Define global styles, resets, and CSS variables in `src/styles/globals.css`. (Rule 16.1 from `custom_instructions` seems misplaced, assuming it refers to global CSS).
*   **Avoid Inline Styles:** Minimize the use of the `style` prop for complex or frequently changing styles; prefer utility classes, CSS Modules, or styled-component approaches.

## 5. TypeScript

*   **Strict Mode:** Ensure `strict: true` is enabled in `tsconfig.json`. (Rule 2.1)
*   **Avoid `any`:** Explicitly avoid using the `any` type. Use specific types, generics, `unknown`, or define interfaces/types. The only exception is potentially in test files or unavoidable third-party library integrations. (Rule 2.1)
*   **Explicit Types:** Provide explicit types for function parameters, return values (especially for utilities and hooks), and complex variable declarations.
*   **Interfaces vs. Types:** Use `interface` for defining the shape of objects and props. Use `type` for unions, intersections, primitives, and more complex type manipulations.
*   **Utility Types:** Leverage TypeScript's built-in utility types (`Partial`, `Required`, `Pick`, `Omit`, `Readonly`, etc.) where appropriate.
*   **Type Guards:** Use type guards (`typeof`, `instanceof`, custom functions returning `parameter is Type`) for narrowing types safely, especially when dealing with potentially undefined values or API responses. (Rule 5.5)
*   **Enums:** Prefer string literal unions (e.g., `type Status = 'pending' | 'success' | 'error'`) over numeric `enum`s for better readability and debugging. Use `const enum` if runtime footprint is a concern, or regular `enum` if reverse mapping is needed.
*   **Exhaustive Conditionals:** When working with discriminated unions, ensure switch statements or conditional logic cover all possible variants, potentially using a helper function for exhaustiveness checking. (Rule 2.2)

## 6. Data Fetching & API Interaction

*   **API Client:** Use the configured API client instance (e.g., Axios) from `src/lib/api/client.ts` for all backend requests. This client should handle base URL, interceptors for auth tokens, tenant headers, and potentially default error handling.
*   **Endpoint Functions:** Define specific functions for each API call in `src/lib/api/endpoints/` grouped by domain (e.g., `getWorkers`, `createSegment`). These functions should handle request/response typing.
*   **Server State Management:** Use `react-query` or `SWR` (via custom hooks like `useWorkersApi`) to invoke the endpoint functions. Leverage its caching, refetching, and mutation capabilities. (Rule 4.5)
*   **Error Handling:**
    *   Handle API errors gracefully within components or hooks using `try/catch` for async operations or the error state provided by `react-query`/`SWR`. (Rule 5.4)
    *   Display user-friendly error messages or use toast notifications. Avoid exposing raw technical error details to the user. (Rule 5.2)
    *   Consider using Error Boundaries for critical UI sections. (Rule 5.1)
*   **Data Validation:** Validate API responses (especially from external APIs) using libraries like `zod` to ensure data integrity before using it in the application. (Rule 8.2)

## 7. Custom Hooks

*   **Purpose:** Extract reusable stateful logic, side effects, or complex non-visual logic from components into custom hooks. (Rule 3.1)
*   **Naming:** Prefix custom hooks with `use` (e.g., `useTableControls`). (Rule 3.1)
*   **Return Values:** Return values consistently, typically as an object or an array (like built-in hooks).
*   **Documentation:** Provide JSDoc comments explaining the hook's purpose, parameters, and return values. (Rule 9.1)

## 8. Code Style & Formatting

*   **Linting & Formatting:** Use ESLint and Prettier with the project's configurations (`.eslintrc.js`, `.prettierrc.js`). Ensure code is linted and formatted before committing (using Husky hooks if set up).
*   **Readability:** Prioritize clear, readable code. Use meaningful variable and function names. Keep functions relatively small and focused.
*   **Comments:** Add comments only for non-trivial logic, complex algorithms, or explaining *why* something is done a certain way, not *what* the code does if it's obvious. Avoid excessive or obvious comments. Provide JSDoc for public functions/hooks/components. (Rule 9.1)
*   **Imports:** Organize imports: React imports first, then library imports, then absolute internal imports (`@/`), then relative internal imports.

## 9. Testing

*   **Component Testing:** Use React Testing Library for writing component tests. Focus on testing component behavior from the user's perspective, not implementation details. (Rule 7.1, Rule 7.5)
*   **Unit Testing:** Write unit tests for complex utility functions, hooks, and potentially state logic (reducers).
*   **Mocking:** Use libraries like Jest (`jest.fn`, `jest.mock`) or MSW (Mock Service Worker) for mocking API calls, modules, or dependencies. Organize mocks logically (e.g., `__mocks__` folder). (Rule 7.2)
*   **Coverage:** Aim for reasonable test coverage, focusing on critical paths, complex logic, and edge cases rather than simple rendering tests. (Rule 7.4)

## 10. Next.js Specifics

*   **Server vs. Client Components:** Explicitly mark components with `'use client'` only when necessary (using hooks like `useState`, `useEffect`, browser APIs, or event listeners). Prefer Server Components for data fetching and rendering static content where possible. (Rule 3.4)
*   **Image Optimization:** Always use the `next/image` component for images, providing appropriate `width`, `height`, and `alt` props. (Rule 3.6)
*   **Routing:** Use the `next/link` component for internal navigation and `next/navigation` hooks (`useRouter`, `usePathname`, `useSearchParams`) within Client Components. 