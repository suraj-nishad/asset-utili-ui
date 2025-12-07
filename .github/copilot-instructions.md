# Asset Management UI - AI Agent Instructions

## Project Overview
React + TypeScript + Vite frontend for an asset management system consuming a REST API at `http://localhost:8003`. The app manages assets, work orders, and inventory with a mobile-first, responsive design using **IBM Carbon Design System**.

## Architecture & Tech Stack

**Core Stack:**
- React 19.2 with TypeScript (~5.9.3)
- Vite 7.2.4 for build tooling
- IBM Carbon Design System (`@carbon/react` ^1.97.0) for all UI components
- No routing library - simple state-based view switching in `App.tsx`

**Key Structural Decisions:**
- Single-page app with view switching (Dashboard, Assets, Work Orders, Inventory)
- All API calls through centralized client in `src/utils/api.ts`
- TypeScript interfaces in `src/types/index.ts`
- Component-based architecture in `src/components/`
- Left sidebar navigation (240px fixed) with mobile hamburger menu

## Critical Developer Workflows

**Development:**
```bash
npm run dev          # Start dev server (Vite default: http://localhost:5173)
npm run build        # TypeScript compile + Vite build
npm run lint         # ESLint with TypeScript, React Hooks, React Refresh plugins
npm run preview      # Preview production build
```

**Backend API:** Expects FastAPI backend at `http://localhost:8003` - see `FRONTEND_API_GUIDE.md` for full API spec

## Design System Integration

**ALWAYS use Carbon components** - never create custom buttons, inputs, modals, or tables from scratch:
- `Button` with variants (primary, ghost, danger)
- `TextInput`, `Select`, `TextArea`, `NumberInput`, `DatePicker` for forms
- `DataTable` for desktop list views
- `Tile`, `ClickableTile` for mobile card views  
- `Modal`, `ComposedModal` for overlays
- `Tag` for status badges
- `Loading` for loading states
- `InlineNotification` for errors

**Carbon Setup:**
- Import CSS in `main.tsx`: `import '@carbon/react/css/index.css'`
- Import icons from `@carbon/icons-react` (e.g., `import { Asset, Information } from '@carbon/icons-react'`)
- Custom overrides in `src/index.css` AFTER Carbon CSS import

## Project-Specific Conventions

### Color Scheme
- **Primary Action:** `#1C6BBA` (custom blue) for buttons, links, active states
- **Status Colors:**
  - Green: Active, Completed, Low priority
  - Orange: In Progress, High priority, Low stock warnings
  - Red: Critical priority, Retired, Cancelled
  - Gray: Neutral states (Open, Medium priority)

### Floating Label Pattern
Used consistently for ALL form inputs (see `RECREATION_GUIDE.md` lines 500-520):
```tsx
<div className="input-group">
  <input
    id="field-name"
    className="input-floating"
    value={value}
    onChange={onChange}
    placeholder=" "  // CRITICAL: Space required for CSS selector
  />
  <label htmlFor="field-name" className="label-floating">
    Field Name *
  </label>
</div>
```

CSS uses `:not(:placeholder-shown)` to detect filled state.

### Info-Centric Pattern
- All list views use **single info icon button** (24px) in actions column
- Info icon opens read-only detail modal with full record info
- Edit/delete actions in separate modals (not inline)
- Rationale: Cleaner UI, mobile-friendly, view-first approach

### Responsive Breakpoints
- **Mobile (<768px):** Hamburger menu, card views (Tiles), single column
- **Desktop (≥768px):** Fixed sidebar, DataTables, 2-column grids
- Toggle display with CSS: `.desktop-table { display: none; } @media (min-width: 769px) { .desktop-table { display: table; } }`

## API Integration Patterns

**API Client Structure** (`src/utils/api.ts`):
```typescript
const API_BASE_URL = 'http://localhost:8003';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Always JSON content-type, error handling via response.ok check
}

export const api = {
  dashboard: { getStats: () => fetchAPI('/stats/dashboard') },
  assets: { 
    getAll: (params?) => fetchAPI(`/assets?${queryString}`),
    getById: (id) => fetchAPI(`/assets/${id}`),
    create: (data) => fetchAPI('/assets', { method: 'POST', body: JSON.stringify(data) }),
    // ... etc
  },
  // workOrders, inventory similar structure
};
```

**Standard Data Fetching Pattern:**
```tsx
const [data, setData] = useState<T[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const controller = new AbortController();
  setLoading(true);
  
  api.resource.getAll()
    .then(setData)
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
    
  return () => controller.abort();
}, [dependencies]);
```

## Data Models

**Key Enums:**
- `AssetStatus`: Active | Inactive | In Maintenance | Retired
- `WorkOrderStatus`: Open | In Progress | Completed | Cancelled  
- `WorkOrderPriority`: Low | Medium | High | Critical

**Main Entities** (full schemas in `FRONTEND_API_GUIDE.md`):
- **Asset:** `asset_id` (unique), `name`, `category`, `status`, `location_id`, cost/warranty fields
- **WorkOrder:** `wo_number` (unique), `summary`, `priority`, `status`, `technician`, time tracking
- **InventoryItem:** `part_number` (unique), `item_name`, `stock_on_hand`, `min_stock`, `max_stock`

**Low Stock Logic:** `item.stock_on_hand <= item.min_stock`

## Common Patterns & Gotchas

1. **Mobile Menu:** Must set `mobileMenuOpen={false}` in `onNavigate` callback to close after selection
2. **Modal State:** Always reset `viewingItem` to `null` in modal `onClose` to prevent stale data
3. **Date Formatting:** Use consistent formatter (e.g., `new Date(isoString).toLocaleDateString()`)
4. **Icon Button Accessibility:** Always add `aria-label` to icon-only buttons
5. **Form Validation:** Check required fields client-side, display API error messages in `InlineNotification`

## File References

- **Architecture Guide:** `RECREATION_GUIDE.md` - Complete component specs, styling, implementation phases
- **API Reference:** `FRONTEND_API_GUIDE.md` - All endpoints, request/response formats, error codes
- **OpenAPI Spec:** `openapi.json` - Machine-readable API schema
- **ESLint Config:** `eslint.config.js` - Flat config with TypeScript, React Hooks, React Refresh
- **TypeScript Config:** `tsconfig.app.json` - Strict mode, bundler resolution, React JSX

## Current State

**Scaffold Status:** Vite default template only - no components implemented yet. Follow `RECREATION_GUIDE.md` Phase 1-8 for full implementation (estimated 15-20 hours).

**Next Steps:**
1. Install Carbon: `npm install @carbon/react @carbon/icons-react`
2. Create folder structure: `mkdir -p src/components src/types src/utils`
3. Build type definitions in `src/types/index.ts`
4. Implement API client in `src/utils/api.ts`
5. Start with Navigation + Dashboard components
