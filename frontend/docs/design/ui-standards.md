# UI/UX Standards and Accessibility Requirements

This document outlines the UI/UX standards and accessibility requirements for the Behavior Coach application, ensuring a consistent, usable, and accessible experience for all users.

## Design Principles

1. **Clarity**: Information should be presented clearly and concisely
2. **Consistency**: UI elements should behave consistently throughout the application
3. **Efficiency**: Users should be able to accomplish tasks with minimal effort
4. **Feedback**: The system should provide appropriate feedback for user actions
5. **Accessibility**: The application should be usable by people with diverse abilities

## Color System

### Primary Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary | #5B21B6 (deep purple) | Primary actions, active states, branding |
| Secondary | #2563EB (blue) | Secondary actions, highlights, links |
| Accent | #10B981 (green) | Success, positive indicators |
| Error | #EF4444 (red) | Error messages, destructive actions |
| Warning | #F59E0B (amber) | Warning messages, caution indicators |
| Info | #3B82F6 (blue) | Informational messages |

### Neutrals

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Background | #F9FAFB | Page background |
| Surface | #FFFFFF | Card/component background |
| Border | #E5E7EB | Dividers, borders |
| Text Primary | #111827 | Primary text |
| Text Secondary | #6B7280 | Secondary text, labels |
| Text Disabled | #9CA3AF | Disabled text |

### Accessibility Requirements

- All color combinations must meet WCAG 2.1 AA contrast requirements (minimum 4.5:1 for normal text, 3:1 for large text)
- Provide sufficient contrast between text and background
- Don't rely solely on color to convey information
- Support dark mode with appropriate contrast ratios

## Typography

### Font Families

- **Primary Font**: Inter (or system default sans-serif)
- **Monospace Font**: Geist Mono (for code-related content)

### Font Sizes

| Size Name | Value | Usage |
|-----------|-------|-------|
| xs | 12px | Small labels, footnotes |
| sm | 14px | Secondary text, inputs |
| base | 16px | Body text, regular content |
| lg | 18px | Emphasized content |
| xl | 20px | Subtitles |
| 2xl | 24px | Section headings |
| 3xl | 30px | Page headings |
| 4xl | 36px | Main headings |

### Line Heights

- Headings: 1.2
- Body text: 1.5
- Inputs and buttons: 1.4

### Accessibility Requirements

- Maintain a minimum text size of 14px for general content
- Use relative units (rem) for responsive scaling
- Ensure proper heading hierarchy (h1 → h6)
- Avoid all-caps text for extended content
- Set appropriate line height for readability

## Layout and Spacing

### Grid System

- Utilize a 12-column grid for layout
- Use consistent spacing increments

### Spacing Scale

| Size | Value | Usage |
|------|-------|-------|
| 0 | 0 | No spacing |
| px | 1px | Hairline borders |
| 0.5 | 2px | Minimum spacing |
| 1 | 4px | Tight spacing |
| 2 | 8px | Element spacing |
| 3 | 12px | Compact spacing |
| 4 | 16px | Standard spacing |
| 5 | 20px | Comfortable spacing |
| 6 | 24px | Section spacing |
| 8 | 32px | Container spacing |
| 10 | 40px | Large section spacing |
| 12 | 48px | Page section spacing |
| 16 | 64px | Page spacing |

### Breakpoints

| Breakpoint | Width | Description |
|------------|-------|-------------|
| xs | 360px | Small mobile devices |
| sm | 640px | Mobile devices |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large desktops |

### Accessibility Requirements

- Ensure content is readable without horizontal scrolling at viewport widths ≥320px
- Maintain appropriate touch target sizes (at least 44×44px) for interactive elements
- Provide sufficient space between interactive elements
- Ensure content adapts appropriately at all breakpoints

## Components

### Common UI Elements

#### Buttons

- **Primary Button**: Filled background with primary color
- **Secondary Button**: Outlined with primary color
- **Tertiary Button**: Text-only, no background
- **Destructive Button**: Filled background with error color
- **Icon Button**: Square button with centered icon

Button states:
- Default
- Hover
- Active/Pressed
- Focus
- Disabled
- Loading

#### Form Elements

- Text Inputs
- Select Dropdowns
- Checkboxes
- Radio Buttons
- Toggles
- Sliders
- File Uploads
- Date Pickers

#### Navigation Elements

- Global Navigation Bar
- Sidebar Navigation
- Breadcrumbs
- Tabs
- Pagination

#### Feedback Elements

- Alerts/Notifications
- Toasts
- Modal Dialogs
- Progress Indicators
- Tooltips
- Badges

### Accessibility Requirements for Components

- All interactive elements must be keyboard accessible
- Focus states must be visible and meet contrast requirements
- Form elements must have proper labels
- ARIA roles, states, and properties must be used appropriately
- Sufficient contrast for all component states

## Interactions

### Responsive Behaviors

- Mobile-first approach
- Appropriate layout changes at breakpoints
- Touch-friendly elements on mobile
- Consideration for different input methods (touch, mouse, keyboard)

### Animation and Transitions

- Subtle animations for state changes (200-300ms duration)
- More pronounced animations for modal dialogs (300-400ms duration)
- Reduced motion option for users who prefer minimal animation

### Loading States

- Skeleton screens for content loading
- Spinners for action loading
- Progress bars for determinate operations

### Error Handling

- Inline validation for form fields
- Error messages with clear resolution paths
- System-wide error handling for unexpected errors

### Accessibility Requirements for Interactions

- Animations should respect the prefers-reduced-motion setting
- Loading states should be announced to screen readers
- Error messages should be associated with their corresponding inputs
- Status changes should be announced to screen readers

## Accessibility Technical Requirements

### WCAG 2.1 AA Compliance

- **Perceivable**: Information and UI components must be presentable to users in ways they can perceive
- **Operable**: UI components and navigation must be operable
- **Understandable**: Information and operation of UI must be understandable
- **Robust**: Content must be robust enough to be interpreted by a wide variety of user agents

### Keyboard Navigation

- All interactive elements must be accessible via keyboard
- Logical tab order following visual layout
- Focus management for modals and other interactive components
- Keyboard shortcuts for power users (with documentation)

### Screen Reader Support

- Semantic HTML elements with appropriate roles
- ARIA attributes when semantic HTML is insufficient
- Alt text for images
- Proper heading structure
- Hidden elements for screen reader context

### Focus Management

- Visible focus indicators
- Logical focus order
- Focus trap for modal dialogs
- Restored focus after temporary dialogs

### Form Accessibility

- Labels associated with inputs
- Error messages linked to inputs
- Input validation feedback
- Grouped related controls

### Other Requirements

- Support for screen magnification (up to 400%)
- Support for high contrast mode
- Respect system-level preferences (reduced motion, color schemes)
- Closed captions for video content
- Transcripts for audio content

## Implementation Guidelines

### HTML Best Practices

- Use semantic HTML elements
- Ensure proper document structure
- Use appropriate ARIA roles and attributes when needed
- Implement proper heading hierarchy

### CSS Best Practices

- Use Tailwind utility classes consistently
- Custom classes should follow BEM naming convention
- Implement responsive design using the defined breakpoints
- Use relative units (rem) for sizing

### JavaScript Best Practices

- Ensure all interactive elements are keyboard accessible
- Manage focus appropriately
- Use appropriate ARIA states for dynamic content
- Test with screen readers

### Testing Requirements

- Regular accessibility audits using tools like Lighthouse or axe
- Manual testing with keyboard navigation
- Screen reader testing
- Testing with various zoom levels and viewport sizes
- Color contrast checking

By adhering to these standards, we ensure that the Behavior Coach application provides a consistent, intuitive, and accessible experience for all users. 