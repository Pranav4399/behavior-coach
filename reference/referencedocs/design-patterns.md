# ABCD Behavior Coach - Frontend Design Patterns

This document outlines the key visual design patterns and conventions observed in the root `src` directory. Following these guidelines for the new `abcd-behavior-coach/frontend` will help ensure visual consistency across the entire application.

## 1. UI Library & Theming

*   **Primary Library:** Material UI (MUI) (`@mui/material`). Components like `Box`, `Container`, `Button`, `TextField`, `Stack`, `Typography` are used extensively.
*   **Theming:** A comprehensive custom MUI theme is defined in `src/styles/theme.ts` using `createTheme`.
    *   This theme defines the core color palette, typography scale, spacing units, and potentially some default component props/styles/variants (though specific component styles seem often applied via `sx` prop in custom wrapper components).
    *   **Recommendation:** Replicate or adapt this theme structure for the new frontend in `abcd-behavior-coach/frontend/src/styles/theme.ts` to maintain consistency. Pay close attention to palette, typography, and font loading.

## 2. Color Palette

*   **Source:** Defined within the `palette` key in `src/styles/theme.ts`.
*   **Key Colors:**
    *   `primary.main`: `#003D63`
    *   `primary.light`: `#28666e`
    *   `primary.dark`: `#033f63`
    *   `secondary.main`: `#033f63` (Note: Matches `primary.dark`)
    *   `error.main`: `red.A400` (Imported from `@mui/material/colors`)
    *   `warning.main`: `#F3B649`
    *   `success.main`: `#04B27A`
    *   `success.dark`: `#23666E`
    *   `success.light`: `#E4ECC5`
    *   `background.default`: `#fff` (Main application background often overridden to `#f2f2f2` in `layout.tsx`).
    *   `background.paper`: Not explicitly defined, likely defaults to `#fff`.
    *   `text.primary`: Not explicitly defined, check MUI defaults or component usage (often dark gray/black like `#212121`, `#444`).
    *   `text.secondary`: Not explicitly defined, check MUI defaults or component usage (often gray like `#646464`).
*   **Recommendation:** Define these exact colors in the new frontend's theme palette. Verify default text colors if needed by inspecting rendered components.

## 3. Typography

*   **Font Families:**
    *   **Google Fonts:** `Spline_Sans` (loaded via `@next/font/google`).
    *   **Local Fonts:** `CabinetGrotesk`, `MonaSans`, `MonaSansCondensed`, `General_Sans` (loaded via `@next/font/local` from `src/styles/fonts/`). Font files (`.woff2`) must be copied to the new project.
*   **Theme Variants:** The MUI theme defines numerous *custom* typography variants beyond the defaults (e.g., `H1_CG`, `H2_CG`, `B1_GS`, `B2_GS`, `MS_400`, `SS_500`, `CG_700`, etc.). These map specific font families, weights, sizes, and line heights defined in `theme.ts`. Standard MUI variants (`h1`-`h6`, `body1`, `body2`, `caption`) are also overridden with specific styles.
*   **Base Font:** Default `fontFamily` cascade in the theme starts with `General_Sans`. `body1` uses `General_Sans`, `body2` uses `CabinetGrotesk`.
*   **Recommendation:**
    *   Ensure the same custom fonts (`.woff2` files) are available in the new frontend's `public/fonts` directory (or equivalent).
    *   Replicate the custom font loading (`@next/font/local`, `@next/font/google`) and the *exact* custom typography variants (including standard overrides) defined in `src/styles/theme.ts` for the new frontend theme.
    *   Use the defined theme variants (`<Typography variant="H1_CG">...`) instead of manually setting font styles wherever possible.

## 4. Layout & Spacing

*   **Primary Layout:** The main authenticated application layout (seen in `src/layout/layout.tsx`) typically involves:
    *   A fixed-width sidebar (`Sidebar` component), width `280px` on `md` screens and up, `275px` below `md`. Uses `src/layout/sidebar/sidebar.tsx`.
    *   A top header (`Header` component). Uses `src/layout/header/header.tsx`.
    *   A main content area, often wrapped in MUI `Container` and `Box`. The outermost `Box` often has `backgroundColor: "#f2f2f2"`. The main layout container (`Stack` direct child) uses `backgroundColor: "#fff"` and `boxShadow: "0px 0px 6px 4px #00000033"`.
    *   Conditional rendering of layout elements (e.g., `PublicHeader`, hiding sidebar) based on route checks (e.g., `isPublicPage`, `isOnboardingPage`, `isAnalyzePage`).
*   **Responsive Design:** Uses MUI's `useMediaQuery` hook and breakpoints (`theme.breakpoints.up/down`) extensively to adjust layout (e.g., sidebar width, conditional rendering).
*   **Spacing Unit:** Assumed to use MUI's default theme spacing unit (usually `8px`). Spacing is applied via the `sx` prop (e.g., `mb: 2` for `16px` margin-bottom, `marginBottom: "8px"`) or potentially within component style overrides in the theme.
*   **Recommendation:**
    *   Adopt a similar primary layout structure (Sidebar + Header + Content Area) using MUI components for the main authenticated app sections in `abcd-behavior-coach/frontend/src/app/(app)/layout.tsx`. Match sidebar width and background colors.
    *   Replicate the responsive patterns using `useMediaQuery`.
    *   Utilize the theme's spacing unit (`theme.spacing(x)`) or shorthand (e.g., `p: 1`, `m: 2`) in the `sx` prop for consistent padding and margins. Avoid hardcoded pixel values for spacing where possible.

## 5. Component Styles

*   **General Approach:** Leverage MUI component defaults. Custom components often wrap MUI components and apply specific styles via the `sx` prop directly within the wrapper component. Theme-level component overrides (`theme.components`) might be less common for base styling but could be used for variants. CSS Modules are used occasionally (e.g., `styles.module.scss`).
*   **Buttons (`CustomButton` from `src/components/ui-components/common/custom--button.tsx`):**
    *   Wraps `MuiButton`.
    *   Defaults to `variant="contained"`, `color="primary"`.
    *   Applies base styles via `sx` prop:
        *   `boxShadow: "none"`
        *   `textTransform: "none"`
        *   `fontWeight: 600`
        *   `height: "40px"`
        *   `borderRadius: "2px"`
        *   `fontSize: "13px"`
    *   Uses a CSS module class (`styles.addworkspacebutton`), indicating some styles might live there.
    *   **Recommendation:** Create a similar `CustomButton` wrapper or define these styles as a default theme override for `MuiButton` (`theme.components.MuiButton.styleOverrides.root`) in the new frontend theme.
*   **Inputs (`CustomInput` from `src/components/ui-components/common/custom-input.tsx`):**
    *   Wraps `MuiTextField`.
    *   Defaults to `variant="outlined"`.
    *   Uses `InputLabel` separately with specific styles applied via `sx`:
        *   `fontSize: "14px"`
        *   `color: "#444"`
        *   `fontWeight: 500`
        *   `marginBottom: "8px"`
    *   Applies styles to the input itself via `sx` prop targeting `& .MuiOutlinedInput-root`:
        *   `fontSize: "18"`
        *   `color: "#495057"`
        *   `borderRadius: "5px"`
        *   `border: "1px solid rgba(91, 100, 100, 0.33)"` (Overrides the default outline)
    *   Overrides `& .MuiOutlinedInput-notchedOutline` `borderColor` to `#EBEBEB`.
    *   **Recommendation:** Create a similar `CustomInput` wrapper component or define these overrides within the theme for `MuiTextField`, `MuiOutlinedInput`, and `MuiInputLabel` (`theme.components.MuiTextField.styleOverrides`, `theme.components.MuiInputLabel.styleOverrides`).
*   **Cards / Surfaces:** While not explicitly read, likely uses MUI `Card` or `Paper` components. Look for consistent `boxShadow` (e.g., `0px 0px 6px 4px #00000033` seen in layout), `borderRadius`, and `padding` values used with these components in the existing codebase.
*   **Recommendation:** Identify other common components (Tables, Modals, Chips, Badges, Selects, etc.) in the existing `src` by browsing `src/components`. Document their recurring visual styles (padding, borders, radius, typography). Define theme overrides or create consistent wrapper components for these in the new frontend.

## 6. Iconography

*   **Library:** Likely uses Material Icons (`@mui/icons-material`) as it integrates seamlessly with MUI (verify by checking imports in components using icons).
*   **Usage:** Icons are used within Buttons (`startIcon`, `endIcon`), ListItems, Sidebar navigation, etc.
*   **Recommendation:** Standardize on `@mui/icons-material`. Define consistent icon sizing and colors through the theme (`theme.components.MuiSvgIcon`) or utility classes if needed.

## 7. Styling Methods Summary

*   **Primary:** MUI Theme (`createTheme`) for global styles (palette, typography definitions, font loading) and potentially some component default overrides/variants.
*   **Secondary:** MUI `sx` prop for component instance-specific style adjustments, layout, and often for defining the base look of custom wrapper components.
*   **Tertiary:** CSS Modules (`*.module.scss`) for more complex component-specific styles, potentially scoped animations, or when standard CSS features are needed.
*   **Global:** `globals.css` for base resets, potentially global font-face definitions (though handled by `@next/font` in `theme.ts`), and potentially global utility classes (usage seems limited).

**Recommendation for New Frontend:** Maintain this hierarchy.
1.  Define foundational elements (colors, typography, fonts, base spacing) and strive for default component style overrides in the MUI **theme**.
2.  Use the **`sx` prop** for layout, responsive adjustments, and one-off style variations. Create reusable wrapper components applying consistent `sx` for common elements like Buttons/Inputs if theme overrides are insufficient.
3.  Use **CSS Modules** sparingly for highly complex, self-contained component styles.

## 8. Additional Patterns (To Investigate Further in `src`)

*   **State Management:** How is global state handled? (`Context API`, Redux, Zustand?) Example: `src/context/ContextProvider.tsx`.
*   **Data Fetching:** How is API data fetched and managed? (Direct `fetch`, Axios, `react-query`, `SWR`?) Check `src/utils/api.ts` or page components.
*   **Forms:** How are forms handled? (MUI components directly, `react-hook-form`?) Look in pages with forms (e.g., auth, settings).
*   **Routing:** Next.js App Router or Pages Router? (`src/pages` suggests Pages Router, `src/app` would indicate App Router). The current structure uses Pages Router.
*   **Authentication:** How is auth managed? (Context, library like NextAuth.js?) Check `src/context`, `src/pages/auth`.
*   **Error Handling:** Are there common error components or patterns? Error Boundaries?
*   **Testing:** What testing libraries are used? (`jest`, `@testing-library/react`?) Look for `*.test.tsx` files or a `__tests__` folder. 