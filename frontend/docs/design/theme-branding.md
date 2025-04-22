# Theme and Branding Application

This document outlines the theme and branding elements for the Behavior Coach application, providing guidelines for consistent application of visual identity across the UI.

## Design Tokens

Design tokens are the visual design atoms of the design system – specifically, they are named entities that store visual design attributes. We use these tokens to maintain a scalable and consistent visual system.

### Implementation with TailwindCSS

The design tokens are implemented in TailwindCSS as custom theme values:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',  // Primary brand color
          900: '#4c1d95',
          950: '#2e1065',
        },
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',  // Secondary brand color
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // Success color
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // Warning color
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // Error color
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        gray: {
          50: '#f9fafb',   // Background color
          100: '#f3f4f6',
          200: '#e5e7eb',  // Border color
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',  // Secondary text
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',  // Primary text
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
};
```

## Color Application

The color palette should be applied consistently across the application:

### UI Elements

| Element | Color Token | Tailwind Class |
|---------|-------------|----------------|
| Primary Button | primary-800 | `bg-primary-800 text-white` |
| Secondary Button | white with primary-800 border | `bg-white text-primary-800 border border-primary-800` |
| Tertiary Button | transparent with primary-800 text | `text-primary-800` |
| Destructive Button | error-500 | `bg-error-500 text-white` |
| Links | secondary-600 | `text-secondary-600` |
| Success States | success-500 | `text-success-500` |
| Warning States | warning-500 | `text-warning-500` |
| Error States | error-500 | `text-error-500` |
| Page Background | gray-50 | `bg-gray-50` |
| Card Background | white | `bg-white` |
| Borders | gray-200 | `border-gray-200` |
| Text - Primary | gray-900 | `text-gray-900` |
| Text - Secondary | gray-500 | `text-gray-500` |
| Text - Disabled | gray-400 | `text-gray-400` |

### Status Indicators

| Status | Color | Tailwind Class |
|--------|-------|----------------|
| Active | success-500 | `bg-success-500` |
| Pending | warning-500 | `bg-warning-500` |
| Inactive | gray-400 | `bg-gray-400` |
| Error | error-500 | `bg-error-500` |

### Badges

| Type | Background | Text | Tailwind Class |
|------|------------|------|----------------|
| Admin | primary-100 | primary-800 | `bg-primary-100 text-primary-800` |
| Client | secondary-100 | secondary-800 | `bg-secondary-100 text-secondary-800` |
| Expert | indigo-100 | indigo-800 | `bg-indigo-100 text-indigo-800` |
| Default | gray-100 | gray-800 | `bg-gray-100 text-gray-800` |

## Typography Application

### Headings

| Element | Font Family | Weight | Size | Line Height | Tailwind Class |
|---------|------------|--------|------|-------------|----------------|
| h1 | Geist Sans | Bold | 30px | 1.2 | `font-sans font-bold text-3xl leading-tight` |
| h2 | Geist Sans | Bold | 24px | 1.2 | `font-sans font-bold text-2xl leading-tight` |
| h3 | Geist Sans | Semibold | 20px | 1.3 | `font-sans font-semibold text-xl leading-snug` |
| h4 | Geist Sans | Semibold | 18px | 1.3 | `font-sans font-semibold text-lg leading-snug` |
| h5 | Geist Sans | Semibold | 16px | 1.4 | `font-sans font-semibold text-base leading-normal` |
| h6 | Geist Sans | Semibold | 14px | 1.4 | `font-sans font-semibold text-sm leading-normal` |

### Body Text

| Element | Font Family | Weight | Size | Line Height | Tailwind Class |
|---------|------------|--------|------|-------------|----------------|
| Body Large | Geist Sans | Regular | 18px | 1.5 | `font-sans text-lg leading-relaxed` |
| Body | Geist Sans | Regular | 16px | 1.5 | `font-sans text-base leading-relaxed` |
| Body Small | Geist Sans | Regular | 14px | 1.5 | `font-sans text-sm leading-relaxed` |
| Caption | Geist Sans | Regular | 12px | 1.4 | `font-sans text-xs leading-normal` |

### Special Text

| Element | Font Family | Weight | Size | Line Height | Tailwind Class |
|---------|------------|--------|------|-------------|----------------|
| Code | Geist Mono | Regular | 14px | 1.5 | `font-mono text-sm leading-relaxed` |
| Button | Geist Sans | Medium | 14px | 1.4 | `font-sans font-medium text-sm leading-normal` |
| Link | Geist Sans | Regular | (inherited) | (inherited) | `font-sans text-secondary-600 hover:underline` |

## Spacing and Layout

### Container Widths

| Size | Max Width | Tailwind Class |
|------|-----------|----------------|
| Small | 640px | `max-w-sm` |
| Medium | 768px | `max-w-md` |
| Large | 1024px | `max-w-lg` |
| Extra Large | 1280px | `max-w-xl` |
| 2XL | 1536px | `max-w-2xl` |
| Full | 100% | `max-w-full` |

### Section Spacing

| Location | Spacing | Tailwind Class |
|----------|---------|----------------|
| Page Padding (Desktop) | 32px | `p-8` |
| Page Padding (Mobile) | 16px | `p-4` |
| Section Margin (Vertical) | 48px | `my-12` |
| Card Padding | 24px | `p-6` |
| Between Form Fields | 16px | `space-y-4` |
| Between Related Elements | 8px | `space-y-2` |

## Component-Specific Branding

### Buttons

```jsx
// Primary Button
<button className="bg-primary-800 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md">
  Primary Button
</button>

// Secondary Button
<button className="bg-white hover:bg-gray-50 text-primary-800 font-medium py-2 px-4 border border-primary-800 rounded-md">
  Secondary Button
</button>

// Tertiary Button
<button className="text-primary-800 hover:text-primary-700 font-medium py-2 px-4">
  Tertiary Button
</button>

// Destructive Button
<button className="bg-error-500 hover:bg-error-600 text-white font-medium py-2 px-4 rounded-md">
  Delete
</button>
```

### Cards

```jsx
<div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
  <h3 className="text-xl font-semibold text-gray-900 mb-4">Card Title</h3>
  <p className="text-gray-500">Card content goes here</p>
</div>
```

### Alerts

```jsx
// Success Alert
<div className="bg-success-50 border-l-4 border-success-500 text-success-700 p-4 rounded-md">
  <div className="flex">
    <div className="flex-shrink-0">
      <CheckCircleIcon className="h-5 w-5 text-success-500" />
    </div>
    <div className="ml-3">
      <p className="text-sm">Success message goes here</p>
    </div>
  </div>
</div>

// Error Alert
<div className="bg-error-50 border-l-4 border-error-500 text-error-700 p-4 rounded-md">
  <div className="flex">
    <div className="flex-shrink-0">
      <XCircleIcon className="h-5 w-5 text-error-500" />
    </div>
    <div className="ml-3">
      <p className="text-sm">Error message goes here</p>
    </div>
  </div>
</div>
```

### Forms

```jsx
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Email Address
    </label>
    <input 
      type="email" 
      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50" 
    />
  </div>
  
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Password
    </label>
    <input 
      type="password" 
      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50" 
    />
  </div>
  
  <div className="flex items-center">
    <input 
      type="checkbox" 
      className="h-4 w-4 text-primary-800 focus:ring-primary-500 border-gray-300 rounded" 
    />
    <label className="ml-2 block text-sm text-gray-700">
      Remember me
    </label>
  </div>
</div>
```

## Dark Mode Support

The application supports dark mode through Tailwind's dark mode variant:

```jsx
// Card with dark mode support
<div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Card Title</h3>
  <p className="text-gray-500 dark:text-gray-400">Card content goes here</p>
</div>
```

### Dark Mode Color Mapping

| Light Mode Color | Dark Mode Color | Element |
|------------------|----------------|---------|
| white | gray-800 | Card background |
| gray-50 | gray-900 | Page background |
| gray-900 | gray-100 | Primary text |
| gray-500 | gray-400 | Secondary text |
| gray-200 | gray-700 | Borders |

## Organization Branding Customization

The application allows organizations to customize certain branding elements:

1. **Logo**: Organization can upload a custom logo
2. **Primary Color**: Limited customization of the primary color

```jsx
// Example of organization color customization
export function OrganizationBrandingProvider({ children }) {
  const { data: organization } = useMyOrganization();
  
  // Apply organization branding if available
  useEffect(() => {
    if (organization?.branding?.primaryColor) {
      document.documentElement.style.setProperty(
        '--color-primary-800', 
        organization.branding.primaryColor
      );
    }
  }, [organization]);
  
  return <>{children}</>;
}
```

## Assets and Resources

### Icons

The application uses Lucide React for icons:

```jsx
import { User, Settings, Bell } from 'lucide-react';

<Button>
  <User className="h-4 w-4 mr-2" />
  Profile
</Button>
```

### Illustrations

Empty states and onboarding screens use custom illustrations that align with the brand style:

1. Empty state illustrations
2. Success/completion illustrations
3. Feature highlight illustrations

### Loading States

```jsx
// Button loading state
<button className="bg-primary-800 text-white font-medium py-2 px-4 rounded-md flex items-center" disabled>
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  Processing...
</button>
```

By adhering to these theme and branding guidelines, we ensure that the Behavior Coach application has a consistent, professional, and cohesive visual identity across all screens and components. 