# Responsive Design Requirements

This document outlines the responsive design requirements for the Behavior Coach application, ensuring a consistent and optimal user experience across all devices and screen sizes.

## General Principles

1. **Mobile-First Approach**: Design for mobile first, then progressively enhance for larger screens
2. **Content Priority**: Focus on essential content and functionality for smaller viewports
3. **Flexibility**: UI elements should adapt fluidly to different screen sizes
4. **Performance**: Consider performance implications, especially for mobile devices
5. **Consistency**: Maintain consistent UI patterns across different screen sizes

## Breakpoints

The application uses the following breakpoints:

| Breakpoint | Width | Device Category |
|------------|-------|-----------------|
| xs | 360px | Small mobile devices |
| sm | 640px | Mobile devices |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large desktops |

## Layout Changes

### Navigation

| Breakpoint | Behavior |
|------------|----------|
| xs, sm | Bottom navigation bar for primary actions, hamburger menu for full menu |
| md | Collapsed sidebar with icons only |
| lg, xl, 2xl | Expanded sidebar with text and icons |

### Content Structure

| Breakpoint | Behavior |
|------------|----------|
| xs, sm | Single column layout, stacked sections |
| md | Two column layout for some content |
| lg, xl, 2xl | Multi-column layout with sidebar |

## Page-Specific Requirements

### Dashboard Pages

| Breakpoint | Behavior |
|------------|----------|
| xs, sm | Stack all cards vertically, full width |
| md | 2-column grid for smaller cards |
| lg, xl | 3-column grid for smaller cards, 2-column for larger cards |
| 2xl | 4-column grid for smaller cards, 3-column for larger cards |

#### Data Visualizations
- Charts should be responsive with appropriate dimensions
- On xs/sm screens, simplify visualizations to show key information
- Consider alternative visualizations for smaller screens (e.g., bar instead of pie charts)

### Organization Profile Page

| Breakpoint | Behavior |
|------------|----------|
| xs, sm | Stack all sections vertically<br>Hide secondary information<br>Header image shrinks in height |
| md | Show more information<br>Sidebar is collapsible |
| lg, xl, 2xl | Full layout with sidebar, main content, and supplementary content |

#### Organization Header
- On xs/sm: Simplified header with minimal info
- On md+: Full header with all organization details

#### Tabs Navigation
- On xs/sm: Scrollable horizontal tabs, or dropdown if many tabs
- On md+: Full-width tab bar

### User Management Pages

| Breakpoint | Behavior |
|------------|----------|
| xs, sm | List view instead of table<br>Limited columns shown<br>Actions in dropdown menu |
| md | Table view with essential columns<br>Some actions directly visible |
| lg, xl, 2xl | Full table with all columns<br>All actions visible |

#### Search and Filters
- On xs/sm: Collapse filters into expandable section
- On md+: Show inline filters with drop-down options

### User Profile Page

| Breakpoint | Behavior |
|------------|----------|
| xs, sm | Simplify header<br>Stack all form sections vertically |
| md | Show more header details<br>Begin to use multi-column layout for forms |
| lg, xl, 2xl | Complete header with all actions<br>Multi-column forms with side navigation |

### Settings Pages

| Breakpoint | Behavior |
|------------|----------|
| xs, sm | No sidebar, navigable with dropdown or accordion sections |
| md | Collapsible settings sidebar, main content area |
| lg, xl, 2xl | Fixed settings sidebar with full content area |

### Form Pages

| Breakpoint | Behavior |
|------------|----------|
| xs, sm | Single column forms with full-width inputs<br>Labels above inputs |
| md | Begin using multi-column layout for suitable forms<br>Consider side-by-side labels and inputs |
| lg, xl, 2xl | Optimized multi-column layout<br>Inline field validation |

## UI Component Adaptations

### Data Tables

| Breakpoint | Behavior |
|------------|----------|
| xs, sm | Transform to list cards with key data<br>Hide less important columns |
| md | Show more columns, but still prioritize<br>Horizontal scrolling if necessary |
| lg, xl, 2xl | Full table with all columns<br>Optional horizontal scrolling for many columns |

### Cards and Containers

- Fluid width based on container
- Consistent padding at all sizes (adjust based on breakpoint)
- Stack content vertically on smaller screens

### Buttons and Actions

| Breakpoint | Behavior |
|------------|----------|
| xs, sm | Stack buttons vertically if multiple primary actions<br>Use full width for primary actions<br>Secondary actions in menu |
| md | Allow horizontal button layouts<br>Show more actions directly |
| lg, xl, 2xl | Show all actions<br>Use appropriate sizing |

### Forms and Inputs

- Input height remains consistent across breakpoints
- Full-width inputs on smaller screens
- Appropriate touch targets (min 44×44px) for all interactive elements

### Modals and Dialogs

| Breakpoint | Behavior |
|------------|----------|
| xs, sm | Full-screen or nearly full-screen modals<br>Simplified content |
| md | Centered modals with responsive width (80-90% of viewport) |
| lg, xl, 2xl | Fixed-width modals with appropriate sizing |

## Implementation Guidelines

### Tailwind CSS Usage

Use Tailwind's responsive prefixes consistently:

```html
<div class="
  w-full           <!-- Default (mobile) -->
  md:w-1/2         <!-- Tablet and up -->
  lg:w-1/3         <!-- Desktop and up -->
">
  Content
</div>
```

### Testing Requirements

- Test each breakpoint during development
- Test on actual devices when possible
- Use browser dev tools for responsive testing
- Consider automated visual regression tests for key layouts

### Performance Considerations

- Optimize images for different screen sizes
- Use appropriate asset loading techniques (responsive images, lazy loading)
- Consider impact of complex layouts on smaller devices
- Test performance on low-end devices

## Common Responsive Patterns

### Responsive Typography

```css
/* Base size for mobile */
h1 { font-size: 1.5rem; }

/* Medium screens */
@media (min-width: 768px) {
  h1 { font-size: 1.75rem; }
}

/* Large screens */
@media (min-width: 1024px) {
  h1 { font-size: 2rem; }
}
```

With Tailwind:

```html
<h1 class="text-2xl md:text-3xl lg:text-4xl">Title</h1>
```

### Responsive Grid Layouts

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <!-- More cards -->
</div>
```

### Responsive Navigation

```html
<!-- Mobile: Bottom navigation -->
<nav class="fixed bottom-0 w-full md:hidden">
  <!-- Mobile nav items -->
</nav>

<!-- Desktop: Sidebar -->
<nav class="hidden md:block w-64">
  <!-- Desktop nav items -->
</nav>
```

## Page-Specific Examples

### Organization Profile Example

```html
<div class="flex flex-col lg:flex-row">
  <!-- Sidebar: Hidden on mobile, visible on lg and up -->
  <aside class="hidden lg:block w-64 p-4">
    <!-- Sidebar content -->
  </aside>
  
  <!-- Main content: Full width on mobile, partial on lg and up -->
  <main class="w-full lg:flex-1 p-4">
    <!-- Organization header: Simplified on mobile -->
    <header class="flex flex-col md:flex-row items-start md:items-center">
      <div class="w-16 h-16 md:w-20 md:h-20">
        <!-- Logo -->
      </div>
      <div class="mt-2 md:mt-0 md:ml-4">
        <h1 class="text-xl md:text-2xl lg:text-3xl">Organization Name</h1>
        <!-- More header content -->
      </div>
    </header>
    
    <!-- Tabs: Scrollable on mobile -->
    <div class="overflow-x-auto md:overflow-visible">
      <div class="flex mt-6 border-b">
        <!-- Tab items -->
      </div>
    </div>
    
    <!-- Tab content -->
    <div class="mt-6">
      <!-- Grid layout for cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Cards -->
      </div>
    </div>
  </main>
</div>
```

By following these responsive design requirements, we ensure that the Behavior Coach application provides an optimal user experience across all devices and screen sizes. 