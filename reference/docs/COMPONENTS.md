# ABCD Behavior Coach - Component System

## 1. Design System Principles

The ABCD Behavior Coach application follows a consistent and cohesive design system to deliver a professional user experience while maintaining development efficiency and scalability. Our design system is guided by the following core principles:

### 1.1 Consistency

We maintain visual and behavioral consistency through:

- **Standardized UI Elements**: Common elements like buttons, inputs, and cards share consistent styling, spacing, and interaction patterns.
- **Visual Language**: A unified color palette, typography scale, spacing system, and iconography.
- **Interaction Patterns**: Predictable and familiar interaction patterns for common tasks (selection, navigation, form submission).

### 1.2 Modularity

Our component system emphasizes:

- **Composability**: Building complex interfaces from simple, reusable parts.
- **Single Responsibility**: Each component handles one specific aspect of the UI.
- **Encapsulated Styles**: Components maintain their own styling without leaking to other parts of the application.

### 1.3 Accessibility

We prioritize accessibility through:

- **WCAG Compliance**: Components meet WCAG AA standards.
- **Keyboard Navigation**: All interactive elements are keyboard accessible.
- **Screen Reader Support**: Proper ARIA attributes and semantic HTML.
- **Color Contrast**: Sufficient contrast ratios for all text elements (minimum 4.5:1).
- **Focus Management**: Visible focus indicators and logical focus order.

### 1.4 Performance

Our components are optimized for:

- **Rendering Efficiency**: Minimal unnecessary re-renders through memoization.
- **Bundle Size**: Careful management of dependencies and code splitting.
- **Lazy Loading**: Components outside the critical path can be loaded on demand.

### 1.5 Flexibility

Our system provides:

- **Customization Options**: Props for common variations without requiring new components.
- **Composition Patterns**: Higher-order components and render props where appropriate.
- **Theming Support**: Ability to adapt the visual appearance through theming.

## 2. Component Library Structure & Organization

The ABCD Behavior Coach component library is organized into a layered, hierarchical structure that promotes reuse and maintainability. This structure reflects both the technical nature of components and their domain-specific purposes.

### 2.1 Component Directory Structure

```
src/
├── components/
│   ├── ui/                # Base UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   └── ...
│   │
│   ├── layout/            # Layout-related components
│   │   ├── AppShell.tsx   # Main application shell
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   ├── Header.tsx     # Top header bar
│   │   └── PageHeader.tsx # Standard header for pages
│   │
│   └── features/          # Feature-specific composite components
│       ├── auth/          # Authentication components
│       ├── workers/       # Worker management components
│       ├── journeys/      # Journey management components
│       ├── segments/      # Segmentation components
│       └── ...            # Other feature domains
```

### 2.2 Component Types & Hierarchy

Our component system is organized in a hierarchical structure, with each layer building upon the previous:

#### 2.2.1 UI Components (Base Primitives)

These are the foundational building blocks, wrapping HTML elements with consistent styling and behavior:

- **Inputs**: Button, TextField, Checkbox, Radio, Select, Slider, Switch
- **Data Display**: Typography, Icon, Avatar, Badge, Chip, Table
- **Feedback**: Alert, Progress, Skeleton, Toast
- **Surfaces**: Card, Paper, Dialog, Drawer, Popover
- **Navigation**: Link, Tabs, Breadcrumbs, Pagination
- **Other**: Divider, Tooltip, List, Menu

#### 2.2.2 Layout Components

These components handle the structural organization of the UI:

- **Containers**: Grid, Box, Stack, Container
- **Application Structure**: AppShell, Sidebar, Header, Footer
- **Page Structure**: PageHeader, Section, SplitView

#### 2.2.3 Feature Components

These are domain-specific components combining multiple base components to fulfill specific use cases:

- **Data Views**: WorkerList, JourneyCard, SegmentTable
- **Forms**: WorkerForm, JourneyBuilderForm, LoginForm
- **Specialized Displays**: ProgressTracker, AnalyticsChart, WellbeingIndicator
- **Feature-Specific**: TouchpointEditor, ExperimentVariantSelector

### 2.3 Shared Component Patterns

Throughout our component library, you'll find these common patterns:

- **Composition Over Inheritance**: Components are composed from smaller pieces rather than using inheritance.
- **Controlled vs. Uncontrolled**: Most components support both controlled and uncontrolled modes.
- **Forward Refs**: Components forward refs to their underlying DOM elements when appropriate.
- **Prop Drilling Minimization**: Context is used where appropriate to avoid excessive prop drilling.

## 3. Component Creation Standards & Patterns

To maintain consistency and quality across our component library, we follow these standards and patterns for creating new components.

### 3.1 Component File Structure

Each component should follow this structure:

```tsx
// 1. Imports
import React from 'react';
import { classnames } from '@/lib/utils';

// 2. Type definitions
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

// 3. Component definition
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className, children, ...props }, ref) => {
    // 4. Internal logic/hooks
    const buttonClasses = classnames(
      'button-base',
      `button-${variant}`,
      `button-${size}`,
      isLoading && 'button-loading',
      className
    );
    
    // 5. Component render
    return (
      <button ref={ref} className={buttonClasses} disabled={isLoading || props.disabled} {...props}>
        {isLoading && <span className="spinner" />}
        {children}
      </button>
    );
  }
);

// 6. Display name and prop documentation
Button.displayName = 'Button';
```

### 3.2 TypeScript Standards

All components must:

- **Use TypeScript**: Define explicit prop interfaces/types.
- **Extend HTML Attributes**: Component props should extend appropriate HTML element attributes when wrapping HTML elements.
- **Avoid `any`**: Use specific types; avoid the `any` type.
- **Props Documentation**: Provide JSDoc comments for props.
- **Type Guards**: Use type guards for props with conditional rendering.

### 3.3 Styling Approach

Components use a consistent styling approach:

- **Tailwind CSS**: Primary styling approach using utility classes.
- **CSS Modules**: For complex components that need styles beyond what Tailwind provides.
- **cn() Utility**: Use the `cn()` utility for conditionally combining classes.
- **Style Props**: Accept `className` prop to allow style overrides from parent components.
- **Responsive Design**: Use Tailwind's responsive modifiers for adaptive layouts.

### 3.4 Component API Design

When designing component APIs:

- **Sensible Defaults**: Provide reasonable default values for props.
- **Consistent Naming**: Use consistent prop names across components (e.g., `isLoading` vs. `loading`).
- **Boolean Props**: Prefix boolean props with `is`, `has`, `should`, etc. (e.g., `isDisabled`).
- **Event Handlers**: Use `onEvent` naming for event handlers (e.g., `onClick`, `onValueChange`).
- **Render Props**: Use render props for customizable parts of components.
- **Component Variants**: Provide `variant` props for different visual styles.
- **Component Sizes**: Provide `size` props for different sizes.

### 3.5 React Best Practices

Components should follow these React best practices:

- **Functional Components**: Use functional components with hooks.
- **Memoization**: Use `React.memo` for components that render often without changing.
- **Hooks Usage**: Place hooks at the top level of the component body.
- **Side Effects**: Contain side effects in `useEffect` hooks with proper dependencies.
- **Conditional Rendering**: Use early returns or ternary operators for conditional rendering.
- **List Rendering**: Always provide a stable, unique `key` prop when rendering lists.

### 3.6 Accessibility Standards

Components must meet these accessibility requirements:

- **Semantic HTML**: Use the most appropriate HTML elements.
- **ARIA Attributes**: Add aria attributes when HTML semantics are not sufficient.
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible.
- **Focus Management**: Manage focus appropriately, especially in modal dialogs.
- **Color Contrast**: Maintain sufficient color contrast ratios.
- **Screen Reader Text**: Provide screen reader only text when visual cues are not enough.

## 4. Usage Examples for Base UI Components

Below are examples of how to use some of the base UI components from our library:

### 4.1 Button Component

```tsx
// Basic usage
<Button>Click Me</Button>

// Different variants
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="ghost">Ghost Button</Button>

// Different sizes
<Button size="sm">Small Button</Button>
<Button size="md">Medium Button</Button>
<Button size="lg">Large Button</Button>

// Loading state
<Button isLoading>Loading</Button>

// As a link (using Next.js Link component)
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>

// With icon
<Button>
  <Icon name="plus" className="mr-2" />
  Add Item
</Button>

// Full width button
<Button className="w-full">Full Width Button</Button>
```

### 4.2 Input Component

```tsx
// Basic usage
<Input placeholder="Enter your name" />

// With label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>

// With error
<div className="space-y-2">
  <Label htmlFor="username">Username</Label>
  <Input id="username" error="Username already taken" />
  <p className="text-red-500 text-sm">Username already taken</p>
</div>

// Disabled state
<Input disabled value="Read only value" />

// With icon
<div className="relative">
  <Input placeholder="Search..." />
  <Icon name="search" className="absolute right-3 top-1/2 transform -translate-y-1/2" />
</div>

// Password input with show/hide toggle
function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Enter password"
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
        onClick={() => setShowPassword(!showPassword)}
      >
        <Icon name={showPassword ? "eye-off" : "eye"} />
      </button>
    </div>
  );
}
```

### 4.3 Card Component

```tsx
// Basic usage
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>This is the main content of the card.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Card with hover effect
<Card className="hover:shadow-lg transition-shadow">
  <CardContent>Hover over me!</CardContent>
</Card>

// Interactive card
<Card 
  as="button"
  onClick={() => console.log('Card clicked!')}
  className="cursor-pointer hover:bg-gray-50 w-full text-left"
>
  <CardContent>
    <p>Click this entire card</p>
  </CardContent>
</Card>

// Card with image
<Card>
  <img src="/example.jpg" alt="Example" className="w-full h-48 object-cover" />
  <CardContent>
    <p>Card with an image</p>
  </CardContent>
</Card>
```

### 4.4 Table Component

```tsx
// Basic usage
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>
        <Badge variant="success">Active</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm">Edit</Button>
      </TableCell>
    </TableRow>
    {/* More rows... */}
  </TableBody>
</Table>

// With pagination
<div>
  <Table>{/* ... table content ... */}</Table>
  <div className="flex justify-between items-center mt-4">
    <p className="text-sm text-gray-500">
      Showing 1-10 of 100 results
    </p>
    <Pagination>
      <PaginationPrevious href="#" />
      <PaginationItem href="#">1</PaginationItem>
      <PaginationItem href="#" isActive>2</PaginationItem>
      <PaginationItem href="#">3</PaginationItem>
      <PaginationEllipsis />
      <PaginationItem href="#">10</PaginationItem>
      <PaginationNext href="#" />
    </Pagination>
  </div>
</div>
```

### 4.5 Modal/Dialog Component

```tsx
// Basic usage
function DialogExample() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to perform this action?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log('Confirmed');
              setOpen(false);
            }}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Form dialog
function FormDialogExample() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit Profile</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            console.log('Submitted:', name);
            setOpen(false);
          }}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## 5. Theming System & Customization Approach

The ABCD Behavior Coach application implements a flexible theming system that allows for consistent styling while supporting customization for different needs.

### 5.1 Tailwind CSS Configuration

The theming system is primarily implemented through Tailwind CSS, with customizations defined in `tailwind.config.js`:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003D63', // primary.main
          light: '#28666e',   // primary.light
          dark: '#033f63',    // primary.dark
        },
        secondary: {
          DEFAULT: '#033f63', // secondary.main
        },
        error: {
          DEFAULT: '#f44336', // error.main
        },
        warning: {
          DEFAULT: '#F3B649', // warning.main
        },
        success: {
          DEFAULT: '#04B27A', // success.main
          dark: '#23666E',    // success.dark
          light: '#E4ECC5',   // success.light
        },
        background: {
          DEFAULT: '#f2f2f2', // background.default
          paper: '#ffffff',   // background.paper
        },
        text: {
          primary: '#212121',   // text.primary
          secondary: '#646464', // text.secondary
        },
      },
      fontFamily: {
        sans: ['var(--font-general-sans)', 'system-ui', 'sans-serif'],
        cabinet: ['var(--font-cabinet-grotesk)', 'system-ui', 'sans-serif'],
        spline: ['var(--font-spline-sans)', 'system-ui', 'sans-serif'],
        mona: ['var(--font-mona-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Custom font sizes if needed
      },
      spacing: {
        // Custom spacing scales if needed
      },
      borderRadius: {
        // Custom border radius values if needed
      },
      boxShadow: {
        card: '0px 0px 6px 4px rgba(0, 0, 0, 0.2)',
        // Other custom shadows
      },
    },
  },
  plugins: [
    // Any Tailwind plugins
  ],
};
```

### 5.2 Font Management

Fonts are loaded and managed through Next.js's built-in font system:

```tsx
// src/styles/fonts.ts
import { Inter, Spline_Sans } from 'next/font/google';
import localFont from 'next/font/local';

// Google fonts
export const splineSans = Spline_Sans({
  subsets: ['latin'],
  variable: '--font-spline-sans',
  display: 'swap',
});

// Local fonts
export const cabinetGrotesk = localFont({
  src: [
    {
      path: '../public/fonts/CabinetGrotesk-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/CabinetGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/CabinetGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-cabinet-grotesk',
  display: 'swap',
});

// Export other fonts: monaSans, generalSans, etc.
```

These font variables are then applied to the HTML element:

```tsx
// src/app/layout.tsx
import { splineSans, cabinetGrotesk, monaSans, generalSans } from '@/styles/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${splineSans.variable} ${cabinetGrotesk.variable} ${monaSans.variable} ${generalSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### 5.3 CSS Variables

We use CSS variables for dynamic values that might change at runtime (like dark mode colors):

```css
/* globals.css */
:root {
  /* Light mode variables */
  --background: 242 242 242;
  --foreground: 33 33 33;
  --card: 255 255 255;
  --card-foreground: 33 33 33;
  --primary: 0 61 99;
  --primary-foreground: 255 255 255;
  /* Additional variables... */
}

.dark {
  /* Dark mode variables */
  --background: 20 20 20;
  --foreground: 242 242 242;
  --card: 38 38 38;
  --card-foreground: 242 242 242;
  --primary: 0 82 133;
  --primary-foreground: 255 255 255;
  /* Additional variables... */
}
```

### 5.4 Theme Management Hooks

We provide a set of hooks for managing theme-related functionality:

```tsx
// src/hooks/useTheme.ts
import { useContext, useEffect } from 'react';
import { ThemeContext, Theme } from '@/context/ThemeProvider';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// Usage in components
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-full bg-background-paper"
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
```

### 5.5 Component Theming

Components can be themed in several ways:

#### 5.5.1 Variants Pattern

The variants pattern allows for predefined style variations:

```tsx
// Define variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-dark",
        secondary: "bg-secondary text-white hover:bg-secondary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // Other variants...
      },
      size: {
        sm: "h-9 px-3 rounded-md text-xs",
        md: "h-10 py-2 px-4",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

// Use variants in component
interface ButtonProps extends 
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  // Additional props...
}

export function Button({ 
  className, 
  variant, 
  size, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

#### 5.5.2 Composition Pattern

Components can be composed from smaller parts to allow flexible styling:

```tsx
// Composable card components
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

// Additional Card subcomponents: CardDescription, CardContent, CardFooter...
```

### 5.6 Customization Guidelines

When customizing components:

1. **Prefer className Props**: Use the `className` prop to extend or override default styles.
2. **Follow Design Tokens**: Use design tokens (colors, spacing, etc.) from the theme.
3. **Responsive Adaptations**: Use Tailwind's responsive prefixes for adaptations.
4. **Dark Mode Support**: Use `dark:` variants for dark mode specific styling.
5. **Maintain Accessibility**: Ensure customizations don't break accessibility requirements.

```tsx
// Example of appropriate customization
<Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
  <CardContent className="p-8">
    <h2 className="text-2xl font-bold">Custom Card</h2>
    <p className="mt-4">
      This card has custom styling that works with the theming system.
    </p>
  </CardContent>
</Card>
```

## 6. Component Documentation Standards

All components in our library should include:

1. **JSDoc Comments**: For component functions and props.
2. **Storybook Stories**: Demonstrating the component in various states and with different props.
3. **README.md File**: For complex components or component groups, explaining usage patterns.

Example JSDoc format:

```tsx
/**
 * Button component for triggering actions or navigation.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click Me
 * </Button>
 * ```
 */
interface ButtonProps {
  /**
   * The visual style of the button
   * @default "primary"
   */
  variant?: 'primary' | 'secondary' | 'ghost';
  
  /**
   * The size of the button
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
  
  // Additional props...
}
```

## 7. Conclusion

Our component system is designed to provide a consistent, accessible, and maintainable foundation for the ABCD Behavior Coach application. By following these principles, patterns, and guidelines, we can create a cohesive user experience while maintaining development efficiency and scalability.

The system is not static—it will evolve as needs change and as we gather feedback from users and developers. Regular reviews and updates to this documentation will help ensure it remains a valuable reference for the team.
