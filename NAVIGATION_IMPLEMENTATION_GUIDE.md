# Navigation Implementation Guide

## Overview
This guide explains how to use the new unified navigation system across your application.

---

## Components Created

### 1. Navigation Context (`src/contexts/NavigationContext.tsx`)
Manages global navigation state including breadcrumbs, mobile menu, and page titles.

### 2. AppNav Component (`src/components/AppNav.tsx`)
The main navigation header with:
- Logo and branding
- Responsive design (mobile hamburger menu)
- User profile menu integration
- Page title display
- Consistent across all pages

### 3. Breadcrumbs Component (`src/components/Breadcrumbs.tsx`)
Shows hierarchical navigation trail:
- Clickable path back to any level
- Icons support
- Current page highlighted
- Auto-truncates long names

### 4. MobileMenu Component (`src/components/MobileMenu.tsx`)
Full-screen mobile navigation with:
- User profile section
- Credits display
- Main navigation links
- Settings and sign out
- Smooth slide-in animation
- Backdrop blur effect

### 5. AppLayout Component (`src/components/AppLayout.tsx`)
Wrapper component that combines:
- AppNav header
- Breadcrumbs (optional)
- Main content area
- MobileMenu

### 6. useBreadcrumbs Hook (`src/hooks/useBreadcrumbs.ts`)
Easy-to-use hook for setting breadcrumbs and page titles.

---

## How to Use

### Basic Page Setup

```typescript
import { AppLayout } from '../components/AppLayout'
import { useBreadcrumbs } from '../hooks/useBreadcrumbs'

export function MyPage() {
  // Set breadcrumbs and page title
  useBreadcrumbs([
    { label: 'Dashboard', path: '/app' },
    { label: 'My Page', path: '/app/my-page' }
  ], 'My Page Title')

  return (
    <AppLayout>
      {/* Your page content */}
      <div className="container mx-auto px-4 py-8">
        <h1>My Page</h1>
      </div>
    </AppLayout>
  )
}
```

### Without Breadcrumbs

```typescript
export function Landing() {
  return (
    <AppLayout showBreadcrumbs={false}>
      {/* Content */}
    </AppLayout>
  )
}
```

### Custom Actions (Hide User Menu)

```typescript
export function PublicPage() {
  return (
    <AppLayout showActions={false}>
      {/* Content */}
    </AppLayout>
  )
}
```

---

## Breadcrumb Examples

### Dashboard
```typescript
useBreadcrumbs([
  { label: 'Dashboard', path: '/app' }
], 'All Projects')
```

### Project View
```typescript
useBreadcrumbs([
  { label: 'Dashboard', path: '/app' },
  { label: projectName, path: `/app/project/${projectId}` }
], projectName)
```

### Editor View
```typescript
useBreadcrumbs([
  { label: 'Dashboard', path: '/app' },
  { label: projectName, path: `/app/project/${projectId}` },
  { label: photoName, path: `/app/editor/${imageProjectId}` }
], `Editing: ${photoName}`)
```

### With Icons
```typescript
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

useBreadcrumbs([
  { label: 'Home', path: '/app', icon: HomeIcon },
  { label: 'Projects', path: '/app/projects' }
])
```

---

## Responsive Behavior

### Desktop (lg+)
- Full navigation in header
- User profile menu visible
- Dashboard link visible
- All actions accessible

### Tablet (md - lg)
- Navigation condenses
- Some text labels hidden
- Icons remain visible
- Hamburger menu appears

### Mobile (< md)
- Hamburger menu only
- Logo visible
- Full menu slides from right
- Touch-optimized targets (44px+)

---

## Mobile Menu Features

### Auto-close on:
- Route change
- Link click
- Backdrop click
- Escape key press

### Prevents scroll when open:
```typescript
document.body.style.overflow = 'hidden'
```

### Active state highlighting:
```typescript
const isActive = (path: string) => location.pathname === path
```

---

## Keyboard Accessibility

### Navigation
- Tab through all links
- Enter/Space to activate
- Escape to close mobile menu

### Focus Management
- Visible focus indicators
- Logical tab order
- Skip to content (future)

### Screen Readers
- Proper ARIA labels
- Landmark regions
- Navigation role

---

## Styling Customization

### AppLayout Custom Classes
```typescript
<AppLayout className="bg-custom-gradient">
  {/* Content */}
</AppLayout>
```

### Header Variants
Edit `AppNav.tsx` to add themes:
```typescript
const theme = isDark ? 'bg-gray-900' : 'bg-white'
```

### Breadcrumb Styling
Edit `Breadcrumbs.tsx` for custom appearance:
```typescript
className="text-custom-color hover:text-custom-hover"
```

---

## Integration with Existing Pages

### Step 1: Import Components
```typescript
import { AppLayout } from '../components/AppLayout'
import { useBreadcrumbs } from '../hooks/useBreadcrumbs'
```

### Step 2: Set Up Breadcrumbs
```typescript
useBreadcrumbs(breadcrumbsArray, pageTitle)
```

### Step 3: Wrap Content
```typescript
return (
  <AppLayout>
    {/* Existing content */}
  </AppLayout>
)
```

### Step 4: Remove Old Header
```typescript
// Remove:
// <Header ... />
// Old navigation code
```

---

## Example: Convert Dashboard Page

### Before:
```typescript
function Dashboard() {
  return (
    <div>
      <Header currentView="home" onNewListing={...} />
      <main>
        {/* Content */}
      </main>
    </div>
  )
}
```

### After:
```typescript
function Dashboard() {
  useBreadcrumbs([
    { label: 'Dashboard', path: '/app' }
  ], 'All Projects')

  return (
    <AppLayout>
      <main>
        {/* Content */}
      </main>
    </AppLayout>
  )
}
```

---

## Best Practices

### 1. Consistent Naming
✅ Use same terms across breadcrumbs and page titles
✅ Match route naming conventions
✅ Keep labels concise (2-3 words max)

### 2. Breadcrumb Hierarchy
✅ Always start with home/dashboard
✅ Maximum 4 levels deep
✅ Each level should be clickable (except last)

### 3. Mobile Optimization
✅ Test touch targets (min 44px)
✅ Verify menu animations
✅ Check text truncation
✅ Test landscape orientation

### 4. Performance
✅ Use React.memo for expensive components
✅ Avoid unnecessary re-renders
✅ Debounce search/filter inputs

### 5. Accessibility
✅ Test with keyboard only
✅ Verify screen reader announcements
✅ Check color contrast ratios
✅ Provide skip links

---

## Common Patterns

### Dynamic Breadcrumbs
```typescript
const projectName = project?.name || 'Loading...'

useBreadcrumbs([
  { label: 'Dashboard', path: '/app' },
  { label: projectName, path: `/app/project/${projectId}` }
], projectName)
```

### Conditional Navigation
```typescript
const breadcrumbs = isEditor
  ? [
      { label: 'Dashboard', path: '/app' },
      { label: projectName, path: `/app/project/${projectId}` },
      { label: photoName, path: `/app/editor/${imageId}` }
    ]
  : [
      { label: 'Dashboard', path: '/app' },
      { label: projectName, path: `/app/project/${projectId}` }
    ]

useBreadcrumbs(breadcrumbs)
```

### Loading States
```typescript
const pageTitle = isLoading ? 'Loading...' : project.name

useBreadcrumbs(breadcrumbs, pageTitle)
```

---

## Troubleshooting

### Breadcrumbs Not Showing
- Check `showBreadcrumbs={true}` in AppLayout
- Verify breadcrumbs array is not empty
- Ensure NavigationProvider wraps your app

### Mobile Menu Not Opening
- Verify NavigationProvider is in place
- Check z-index conflicts
- Test in responsive mode

### Navigation Context Error
```typescript
// Error: useNavigation must be used within NavigationProvider
// Solution: Wrap your app in App.tsx:
<NavigationProvider>
  <Routes>...</Routes>
</NavigationProvider>
```

### Breadcrumbs Not Updating
- Check that breadcrumbs array reference changes
- Use useMemo for dynamic breadcrumbs
- Verify dependencies in useBreadcrumbs hook

---

## Future Enhancements

### Planned Features
- [ ] Command palette (⌘K)
- [ ] Recent pages list
- [ ] Keyboard shortcuts
- [ ] Search functionality
- [ ] Quick actions menu
- [ ] Notifications center
- [ ] Help overlay
- [ ] Onboarding tour

### Potential Improvements
- Dark/light theme toggle
- Customizable navigation order
- Collapsible sidebar navigation
- Bottom navigation bar for mobile
- Gesture navigation (swipe back)
- Progressive Web App (PWA) support

---

## Migration Checklist

For each page in your app:

- [ ] Import AppLayout and useBreadcrumbs
- [ ] Remove old Header component
- [ ] Add breadcrumbs hook with correct path
- [ ] Wrap content in AppLayout
- [ ] Test responsive behavior
- [ ] Verify keyboard navigation
- [ ] Check mobile menu
- [ ] Test breadcrumb links
- [ ] Verify page title displays
- [ ] Update any custom styling

---

## Support & Resources

### Documentation
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- Accessibility: https://www.w3.org/WAI/ARIA/

### Code References
- Navigation Context: `src/contexts/NavigationContext.tsx`
- Main Components: `src/components/`
- Hooks: `src/hooks/`

### Testing
```bash
npm run dev    # Test locally
npm run build  # Build for production
```

---

## Summary

The new navigation system provides:
✅ Unified navigation across all pages
✅ Mobile-responsive design
✅ Clear user orientation with breadcrumbs
✅ Accessible keyboard navigation
✅ Consistent branding and UX
✅ Easy to implement and maintain

Start by updating your most-used pages, then gradually migrate the rest. The modular design ensures backward compatibility while you transition.
