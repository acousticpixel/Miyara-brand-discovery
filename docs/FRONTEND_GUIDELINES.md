# Frontend Guidelines

This document defines the design system and component patterns for Miyara Brand Discovery. All components should follow these guidelines to ensure visual consistency.

**Reference:** Visual style inspired by [galam.com](https://galam.com)

---

## Design Tokens

Design tokens are defined in two places:
- **`tailwind.config.ts`** — Extends Tailwind with custom colors, fonts, and spacing
- **`src/app/globals.css`** — CSS custom properties for theme-aware colors

### Color Palette

#### Primary Colors (from galam.com)
| Token | Hex | Usage |
|-------|-----|-------|
| `galam-blue` | `#004C82` | Primary headings, CTAs, important actions |
| `galam-blue-light` | `#7DA6D7` | Secondary text, links, navigation |

#### Miyara Brand Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `miyara-navy` | `#1B2A4E` | Primary text, headings, dark accents |
| `miyara-sky` | `#7DD3FC` | Background accents, section highlights |
| `miyara-sky-light` | `#BAE6FD` | Lighter accent, hover states |
| `miyara-accent` | `#3B82F6` | Interactive elements, buttons, links |

#### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `miyara-success` | `#22C55E` | Positive states, "yes" responses |
| `miyara-warning` | `#F59E0B` | Uncertain states, "maybe" responses |
| `miyara-error` | `#EF4444` | Negative states, "no" responses, errors |

#### Neutrals (from galam.com)
| Token | Hex | Usage |
|-------|-----|-------|
| `galam-white` | `#FFFFFF` | Backgrounds, cards |
| `galam-gray-light` | `#F2F5F8` | Page backgrounds, subtle surfaces |
| `galam-gray` | `#606060` | Body text |
| `galam-gray-dark` | `#222222` | Headings, emphasis |

---

## Typography

### Font Families

```css
/* Display headings (serif) */
font-family: var(--font-playfair), Georgia, serif;

/* Body text (sans-serif) */
font-family: var(--font-roboto), system-ui, sans-serif;
```

### Typography Scale

| Class | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-display-lg` | 60px | 400 | Hero headings |
| `text-display-md` | 48px | 400 | Page titles |
| `text-display-sm` | 36px | 400 | Section headings |
| `text-heading-lg` | 32px | 400 | Large headings |
| `text-heading-md` | 24px | 400 | Medium headings |
| `text-heading-sm` | 20px | 500 | Small headings |
| `text-body-lg` | 18px | 300 | Large body text |
| `text-body-md` | 16px | 300 | Default body (30px line-height) |
| `text-body-sm` | 14px | 400 | Small text, captions |

### Typography Patterns

```tsx
// Display heading (Playfair)
<h1 className="font-playfair text-4xl font-normal text-galam-gray-dark">
  Heading Text
</h1>

// Body text (Roboto)
<p className="font-roboto text-base font-light text-galam-gray leading-relaxed">
  Body text content
</p>

// Label/Nav text
<span className="font-roboto text-sm uppercase tracking-widest text-galam-blue-light">
  Label Text
</span>
```

### Utility Classes

```css
/* Pre-defined in globals.css */
.heading-display  /* Playfair, 4xl, dark headings */
.body-galam       /* Roboto, base, body text */
.label-galam      /* Roboto, uppercase, tracking */
```

---

## Spacing

Based on a 4px grid system. Use Tailwind's default spacing scale:

| Class | Size | Usage |
|-------|------|-------|
| `p-1` / `m-1` | 4px | Tight spacing |
| `p-2` / `m-2` | 8px | Small spacing |
| `p-3` / `m-3` | 12px | Default internal |
| `p-4` / `m-4` | 16px | Standard spacing |
| `p-6` / `m-6` | 24px | Medium spacing |
| `p-8` / `m-8` | 32px | Large spacing |
| `p-12` / `m-12` | 48px | Section spacing |
| `p-16` / `m-16` | 64px | Page section gaps |

### Galam.com Style Spacing

For generous section margins (100px+), use:
- `py-24` (96px) or `py-30` (120px) between major sections
- `gap-8` (32px) between cards
- `p-8` (32px) inside cards for breathing room

---

## Border Radius

| Class | Size | Usage |
|-------|------|-------|
| `rounded-sm` | 2px | Subtle rounding |
| `rounded-md` | 6px | Inputs, small buttons |
| `rounded-lg` | 8px | **Default for cards, buttons** |
| `rounded-xl` | 12px | Modals, large containers |
| `rounded-full` | 9999px | Pills, avatars, badges |

---

## Shadows

| Class | Usage |
|-------|-------|
| `shadow-sm` | Default card shadow |
| `shadow-md` | Hover state, elevated |
| `shadow-lg` | Modals, dropdowns |
| `shadow-xl` | High elevation |
| `shadow-galam` | Subtle galam.com style |
| `shadow-galam-lg` | Larger galam.com style |

---

## Component Patterns

### Buttons

```tsx
// Primary Button
<button className="bg-primary text-primary-foreground rounded-lg px-6 py-3
                   hover:bg-primary/90 transition-all duration-200">
  Primary Action
</button>

// Secondary Button
<button className="border border-primary text-primary rounded-lg px-6 py-3
                   hover:bg-primary hover:text-primary-foreground transition-all duration-200">
  Secondary Action
</button>

// Destructive Button
<button className="bg-miyara-error text-white rounded-lg px-6 py-3
                   hover:bg-miyara-error/90 transition-all duration-200">
  Delete
</button>

// Ghost Button
<button className="text-muted-foreground hover:text-foreground hover:bg-muted
                   rounded-lg px-4 py-2 transition-all duration-200">
  Cancel
</button>
```

### Cards

```tsx
// Standard Card
<div className="bg-card rounded-lg shadow-sm border border-border p-6">
  <h3 className="font-playfair text-xl mb-2">Card Title</h3>
  <p className="text-muted-foreground">Card content</p>
</div>

// Interactive Card
<div className="bg-card rounded-lg shadow-sm border border-border p-6
                hover:shadow-md transition-shadow duration-200 cursor-pointer">
  {/* content */}
</div>

// Elevated Card (galam.com style)
<div className="bg-white rounded-lg shadow-galam p-8">
  {/* generous padding */}
</div>
```

### Form Inputs

```tsx
// Text Input
<input
  type="text"
  className="w-full rounded-lg border border-input bg-background px-4 py-2
             focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
             placeholder:text-muted-foreground"
  placeholder="Enter text..."
/>

// Input with Error
<input
  type="text"
  className="w-full rounded-lg border border-miyara-error bg-background px-4 py-2
             focus:outline-none focus:ring-2 focus:ring-miyara-error"
/>
<p className="text-sm text-miyara-error mt-1">Error message</p>
```

### Loading States

```tsx
// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />

// Skeleton
<div className="bg-muted animate-pulse rounded-lg h-4 w-3/4" />

// Loading Text
<div className="flex items-center gap-2 text-muted-foreground">
  <Spinner className="h-4 w-4 animate-spin" />
  <span>Loading...</span>
</div>
```

### Error States

```tsx
// Error Banner
<div className="bg-red-50 border-l-4 border-miyara-error p-4 rounded-r-lg">
  <p className="text-miyara-error font-medium">Error Title</p>
  <p className="text-miyara-error/80 text-sm">Error description</p>
</div>

// Inline Error
<p className="text-sm text-miyara-error flex items-center gap-1">
  <AlertCircle className="h-4 w-4" />
  Something went wrong
</p>
```

### Empty States

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="rounded-full bg-muted p-4 mb-4">
    <FolderOpen className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="font-medium text-foreground mb-1">No items yet</h3>
  <p className="text-muted-foreground text-sm mb-4">
    Get started by creating your first item
  </p>
  <Button>Create Item</Button>
</div>
```

---

## Dark Mode

Dark mode is supported via the `dark` class on the `<html>` element. Use theme-aware tokens:

```tsx
// Automatic dark mode support via CSS variables
<div className="bg-background text-foreground">
  Auto-adapts to theme
</div>

// Explicit dark mode variants (if needed)
<div className="bg-white dark:bg-slate-900">
  Manual override
</div>
```

### Theme Toggle

Use the `<ThemeToggle />` component to allow users to switch themes:

```tsx
import { ThemeToggle } from '@/components/common/theme-toggle';

<ThemeToggle /> // Cycles: light → dark → system
```

---

## Responsive Breakpoints

| Prefix | Min Width | Usage |
|--------|-----------|-------|
| (none) | 0px | Mobile-first default |
| `sm:` | 640px | Small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Desktops |
| `xl:` | 1280px | Large desktops |
| `2xl:` | 1536px | Extra large |

### Mobile-First Pattern

```tsx
// Stack on mobile, side-by-side on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Left</div>
  <div className="w-full md:w-1/2">Right</div>
</div>

// Content width (galam.com style)
<div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* 80% width effect with responsive padding */}
</div>
```

---

## Animation Standards

All transitions should use `duration-200` (200ms) for consistency with galam.com:

```tsx
// Standard transition
<div className="transition-all duration-200">

// Hover effects
<button className="hover:scale-105 transition-transform duration-200">

// Shadow on hover
<div className="shadow-sm hover:shadow-md transition-shadow duration-200">
```

---

## Accessibility

### Focus States

All interactive elements must have visible focus states:

```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
```

### Color Contrast

- Body text: minimum 4.5:1 contrast ratio
- Large text (24px+): minimum 3:1 contrast ratio
- Interactive elements: clearly distinguishable

### Semantic HTML

- Use `<button>` for actions, `<a>` for navigation
- Use heading hierarchy (`h1` → `h2` → `h3`)
- Include `aria-label` for icon-only buttons
- Use `sr-only` for screen reader text

```tsx
<button aria-label="Close modal">
  <X className="h-4 w-4" />
</button>
```

---

## File Organization

```
src/components/
├── ui/                 # shadcn/ui primitives (button, input, etc.)
├── common/             # Shared components (loading, error, theme)
├── session/            # Session-specific components
├── exercise/           # Exercise UI (cards, progress)
└── deliverable/        # Deliverable display components
```

---

## Quick Reference

### Most Used Classes

```css
/* Layout */
flex flex-col items-center justify-center gap-4
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

/* Spacing */
p-4 p-6 p-8    /* padding */
m-4 my-6 mx-auto    /* margin */
space-y-4    /* vertical stack */

/* Text */
text-foreground text-muted-foreground
font-playfair font-roboto
text-sm text-base text-lg text-xl

/* Backgrounds */
bg-background bg-card bg-muted bg-primary

/* Borders */
border border-border rounded-lg

/* Effects */
shadow-sm hover:shadow-md
transition-all duration-200
```
