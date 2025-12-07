# Asset Management UI - Complete Recreation Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Design System Integration](#design-system-integration)
5. [Core Features & Components](#core-features--components)
6. [API Integration](#api-integration)
7. [Styling & Responsiveness](#styling--responsiveness)
8. [Step-by-Step Implementation](#step-by-step-implementation)

---

## Project Overview

This is a modern, responsive Asset Management System built with React and TypeScript. The application manages:
- **Assets**: Physical equipment and machinery with full CRUD operations
- **Work Orders**: Maintenance and service requests with status tracking
- **Inventory**: Parts and supplies with stock level monitoring
- **Dashboard**: Real-time statistics and KPIs

### Key Characteristics
- **Clean, minimalist UI** with focus on usability
- **Mobile-first responsive design** with hamburger navigation
- **Info-centric approach**: View-only detail modals accessed via info icons
- **Professional color scheme**: Primary blue (#1C6BBA) for actions
- **Consistent layout**: Left sidebar navigation with main content area

---

## Tech Stack

### Core Dependencies
```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@carbon/react": "^1.x.x",
    "@carbon/icons-react": "^11.x.x"
  },
  "devDependencies": {
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "typescript": "~5.9.3",
    "vite": "^7.2.4"
  }
}
```

### Design System
Use **IBM Carbon Design System** for:
- UI components (buttons, inputs, modals, tables)
- Icons (use `@carbon/icons-react`)
- Design tokens (colors, spacing, typography)
- Grid system and responsive utilities

---

## Project Structure

```
asset-mgr/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx           # Left sidebar with nav buttons
│   │   ├── Dashboard.tsx            # Stats overview with 7 cards
│   │   ├── AssetsList.tsx           # Asset table/cards with filters
│   │   ├── AssetDetailView.tsx      # Modal for viewing asset details
│   │   ├── AssetFormModal.tsx       # Form for create/edit asset
│   │   ├── WorkOrdersList.tsx       # Work orders table/cards
│   │   ├── WorkOrderDetailView.tsx  # Modal for viewing WO details
│   │   ├── InventoryList.tsx        # Inventory table/cards
│   │   └── InventoryDetailView.tsx  # Modal for viewing item details
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   ├── utils/
│   │   └── api.ts                   # API client functions
│   ├── App.tsx                      # Main app with routing
│   ├── main.tsx                     # React entry point
│   └── index.css                    # Global styles & overrides
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Design System Integration

### IBM Carbon Setup

1. **Install packages:**
```bash
npm install @carbon/react @carbon/icons-react
```

2. **Import Carbon styles in main.tsx:**
```tsx
import '@carbon/react/css/index.css';
import './index.css'; // Your custom overrides
```

3. **Color Scheme:**
- **Primary Action**: IBM Blue (`#0f62fe`) or custom blue (#1C6BBA)
- **Success**: Green (`#24a148`)
- **Warning**: Orange (`#f1c21b`)
- **Error**: Red (`#da1e28`)
- **Neutral**: Gray scale from Carbon tokens

4. **Key Carbon Components to Use:**
- `Button` (primary, ghost, danger variants)
- `TextInput`, `Select`, `TextArea` (for forms)
- `DataTable` (for desktop table views)
- `Modal`, `ComposedModal` (for detail views and forms)
- `Tile`, `ClickableTile` (for mobile card views)
- `Header`, `SideNav` (for navigation)
- `Tag` (for badges/status indicators)
- `Loading` (for loading states)

---

## Core Features & Components

### 1. Navigation Component

**File:** `src/components/Navigation.tsx`

**Purpose:** Left sidebar with vertical navigation

**Features:**
- Fixed 240px width on desktop
- Logo/title at top: "Asset Manager"
- 4 navigation buttons:
  - Dashboard (icon: `Dashboard` from Carbon)
  - Assets (icon: `Asset`)
  - Work Orders (icon: `TaskComplete`)
  - Inventory (icon: `Package`)
- Active state: highlight current view
- Hover effect: subtle background change
- Copyright footer at bottom
- Mobile: Hidden by default, slides in from left when hamburger clicked

**State Props:**
```tsx
interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  mobileMenuOpen?: boolean;
}
```

**Key Styles:**
```css
.sidebar-nav {
  width: 240px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: linear-gradient(180deg, #f4f4f4 0%, #ffffff 100%);
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

@media (max-width: 768px) {
  .sidebar-nav {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar-nav.mobile-open {
    transform: translateX(0);
  }
}
```

---

### 2. Dashboard Component

**File:** `src/components/Dashboard.tsx`

**Purpose:** Display real-time statistics in a clean grid layout

**API Endpoint:** `GET /stats/dashboard`

**Response Format:**
```typescript
interface DashboardStats {
  total_assets: number;
  active_assets: number;
  total_work_orders: number;
  open_work_orders: number;
  in_progress_work_orders: number;
  low_stock_items: number;
  due_pms_next_7_days: number;
}
```

**Layout:**
- Header with dashboard icon + "Dashboard" title
- 2-column grid on desktop (1 column on mobile)
- 7 stat cards:
  1. Total Assets (icon: `Asset`)
  2. Active Assets (icon: `CheckmarkFilled`)
  3. Total Work Orders (icon: `TaskComplete`)
  4. Open Work Orders (icon: `DocumentBlank`)
  5. In Progress (icon: `InProgress`)
  6. Low Stock Items (icon: `WarningAlt`, orange if > 0)
  7. Preventive Maintenance Due (icon: `Calendar`)

**Card Structure:**
```tsx
<div className="stat-card">
  <div className="stat-icon-label">
    <Icon />
    <span>Label</span>
  </div>
  <div className="stat-value">{value}</div>
</div>
```

**Styling:**
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1C6BBA;
  margin-top: 0.5rem;
}
```

---

### 3. Assets List Component

**File:** `src/components/AssetsList.tsx`

**Purpose:** List all assets with search, filters, and detail view

**API Endpoints:**
- `GET /assets?status={status}&category={category}&search={search}`
- `POST /assets` (for create)
- `PUT /assets/{id}` (for edit)

**Asset Interface:**
```typescript
interface Asset {
  id?: number;
  asset_id: string;          // Unique identifier (required)
  name: string;              // Asset name (required)
  category: string;          // Category (required)
  status: AssetStatus;       // Active | Inactive | In Maintenance | Retired
  location_id?: number;
  owner_cost_center?: string;
  vendor?: string;
  serial_number?: string;
  tag_id?: string;
  purchase_date?: string;    // ISO date
  warranty_expiry?: string;  // ISO date
  purchase_cost?: number;
  meter_reading?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

**Layout Structure:**

**Header:**
```tsx
<div className="flex justify-between items-center mb-16">
  <div className="flex items-center gap-8">
    <Icon icon={Asset} size={24} />
    <h1>Assets</h1>
  </div>
  <button onClick={handleAdd} aria-label="Add New Asset">
    <Icon icon={AddAlt} size={32} color="#1C6BBA" />
  </button>
</div>
```

**Filters Section:**
- Search input (floating label style)
- Status dropdown (All, Active, Inactive, In Maintenance, Retired)
- Category dropdown (dynamically populated from assets)

**Desktop View: Carbon DataTable**
- Columns: Asset ID, Name, Category, Status, Vendor, Serial Number, Purchase Cost, Actions
- Status: Carbon `Tag` component with color coding
- Actions column: Single info icon (size 24, blue)

**Mobile View: Carbon Tiles**
```tsx
<ClickableTile>
  <div className="flex justify-between items-start">
    <div className="flex-grow">
      <div className="font-medium">{asset.asset_id}</div>
      <div className="heading-3">{asset.name}</div>
    </div>
    <div className="flex items-center gap-12">
      <Tag type="green">{asset.status}</Tag>
      <IconButton onClick={() => viewDetails(asset)}>
        <Information size={24} />
      </IconButton>
    </div>
  </div>
  <div className="details">
    {/* Category, Vendor, Serial, Cost */}
  </div>
</ClickableTile>
```

**State Management:**
```tsx
const [assets, setAssets] = useState<Asset[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState<string>('');
const [categoryFilter, setCategoryFilter] = useState<string>('');
const [isModalOpen, setIsModalOpen] = useState(false);
const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);
```

---

### 4. Asset Detail View Component

**File:** `src/components/AssetDetailView.tsx`

**Purpose:** Display all asset information in a read-only modal

**Props:**
```typescript
interface AssetDetailViewProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
}
```

**Layout:**
- Use Carbon `ComposedModal` or custom modal
- Header: Icon + "Asset Details" + Close button (X icon)
- Scrollable content area
- Main info section:
  - Asset ID (large, prominent)
  - Name (heading)
  - Status badge
- Details grid (2 columns on desktop, 1 on mobile):
  - Category (as pill/tag)
  - Serial Number
  - Tag ID
  - Vendor
  - Purchase Date (formatted: "December 7, 2025")
  - Purchase Cost (formatted: "$1,234.56")
  - Warranty Expiry
  - Location ID
  - Cost Center
  - Meter Reading
- Notes section (if exists): Gray background panel
- Footer: Created/Updated timestamps

**Modal Styling:**
```css
.detail-modal {
  max-width: 48rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
```

---

### 5. Asset Form Modal Component

**File:** `src/components/AssetFormModal.tsx`

**Purpose:** Create or edit assets with validation

**Props:**
```typescript
interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  asset?: Asset | null; // If provided, edit mode; otherwise create mode
}
```

**Form Fields (with floating labels):**

**Required Fields (marked with *):**
1. Asset ID* - TextInput
2. Name* - TextInput
3. Category* - Select or ComboBox
4. Status* - Select (Active, Inactive, In Maintenance, Retired)

**Optional Fields:**
5. Location ID - NumberInput
6. Owner Cost Center - TextInput
7. Vendor - TextInput
8. Serial Number - TextInput
9. Tag ID - TextInput
10. Purchase Date - DatePicker
11. Purchase Cost - NumberInput (currency)
12. Warranty Expiry - DatePicker
13. Meter Reading - NumberInput
14. Notes - TextArea (4 rows)

**Floating Label Implementation:**
```tsx
<div className="input-group">
  <input
    id="asset-name"
    type="text"
    className="input-floating"
    value={formData.name}
    onChange={(e) => setFormData({...formData, name: e.target.value})}
    placeholder=" "
    required
  />
  <label htmlFor="asset-name" className="label-floating">
    Name *
  </label>
</div>
```

**Floating Label CSS:**
```css
.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-floating {
  width: 100%;
  padding: 1rem;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.input-floating:focus {
  border-color: #1C6BBA;
}

.label-floating {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 0 0.25rem;
  color: #6f6f6f;
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.2s ease;
}

.input-floating:focus + .label-floating,
.input-floating:not(:placeholder-shown) + .label-floating {
  top: 0;
  transform: translateY(-50%) scale(0.75);
  color: #1C6BBA;
}

.select-floating {
  /* Similar styling for select elements */
}

.textarea-floating {
  /* Similar styling for textarea */
}
```

**Form Actions:**
- Cancel button (ghost/secondary)
- Submit button (primary blue, type="submit")

**Validation:**
- Client-side: Check required fields
- Server-side: Display error messages from API

---

### 6. Work Orders List Component

**File:** `src/components/WorkOrdersList.tsx`

**Purpose:** Manage work orders with status and priority filters

**API Endpoint:** `GET /work-orders?status={status}&priority={priority}`

**WorkOrder Interface:**
```typescript
interface WorkOrder {
  id?: number;
  wo_number: string;         // Unique WO number
  summary: string;           // Brief description
  description?: string;      // Detailed description
  priority: WorkOrderPriority; // Low | Medium | High | Critical
  status: WorkOrderStatus;   // Open | In Progress | Completed | Cancelled
  technician?: string;
  due_date?: string;         // ISO date
  time_spent_hours: number;
  completion_notes?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  pm_template_id?: number;
}
```

**Layout:**
- Header with icon + "Work Orders" + add button
- Filters: Status dropdown, Priority dropdown
- Desktop: DataTable with columns:
  - WO Number, Summary, Priority (badge), Status (badge), Technician, Due Date, Time Spent, Actions (info icon)
- Mobile: Tiles with priority/status badges + info icon in top-right

**Priority Colors:**
- Critical: Red
- High: Orange
- Medium: Gray
- Low: Green

**Status Colors:**
- Completed: Green
- In Progress: Orange
- Open: Gray
- Cancelled: Red

---

### 7. Work Order Detail View

**File:** `src/components/WorkOrderDetailView.tsx`

**Purpose:** Display complete work order information

**Layout Sections:**
1. **Header:** WO Number + Priority/Status badges
2. **Summary:** Large heading
3. **Description:** If exists, in gray panel
4. **Details Grid:**
   - Technician (with person icon)
   - Due Date (with calendar icon)
   - Time Spent (with clock icon)
   - Started At (formatted datetime)
   - Completed At (if exists)
   - PM Template ID (if exists)
5. **Completion Notes:** If exists, in gray panel
6. **Footer:** Created timestamp

---

### 8. Inventory List Component

**File:** `src/components/InventoryList.tsx`

**Purpose:** Track inventory items with stock level monitoring

**API Endpoint:** `GET /inventory`

**InventoryItem Interface:**
```typescript
interface InventoryItem {
  id?: number;
  item_name: string;
  part_number: string;       // Unique identifier
  description?: string;
  stock_on_hand: number;
  min_stock: number;
  max_stock?: number;
  unit_cost?: number;
  created_at: string;
  updated_at: string;
}
```

**Low Stock Logic:**
```typescript
const isLowStock = (item: InventoryItem): boolean => {
  return item.stock_on_hand <= item.min_stock;
};
```

**Layout:**
- Header with icon + "Inventory" + add button
- Desktop: DataTable with columns:
  - Part Number, Item Name, Description, Stock on Hand (orange if low), Min Stock, Max Stock, Unit Cost, Actions
- Mobile: Tiles showing stock levels prominently
- Low stock items: Orange "Low Stock" badge

**Stock Display:**
```tsx
<span className={isLowStock(item) ? 'text-orange font-bold' : ''}>
  {item.stock_on_hand}
</span>
```

---

### 9. Inventory Detail View

**File:** `src/components/InventoryDetailView.tsx`

**Purpose:** Display inventory item details with stock visualizations

**Layout:**
1. **Header:** Part Number + Low Stock badge (if applicable)
2. **Item Name:** Large heading
3. **Description:** Gray panel
4. **Stock Levels Section:** 3 large cards:
   - On Hand (blue/orange based on status)
   - Min Stock (gray)
   - Max Stock (gray)
5. **Stock Status Indicator:**
   - Below minimum: "⚠️ Below minimum level (-X units short)"
   - Adequate: "✓ Adequate stock (+X units above minimum)"
6. **Cost Information:** If unit_cost exists:
   - Unit Cost card
   - Total Value card (unit_cost × stock_on_hand)
7. **Footer:** Created/Updated timestamps

---

## API Integration

### API Client Structure

**File:** `src/utils/api.ts`

```typescript
const API_BASE_URL = 'http://localhost:8000';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  dashboard: {
    getStats: () => fetchAPI('/stats/dashboard'),
  },

  assets: {
    getAll: (params?: { status?: string; category?: string; search?: string }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return fetchAPI(`/assets${query ? `?${query}` : ''}`);
    },
    getById: (id: number) => fetchAPI(`/assets/${id}`),
    create: (data: unknown) => fetchAPI('/assets', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    update: (id: number, data: unknown) => fetchAPI(`/assets/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
    delete: (id: number) => fetchAPI(`/assets/${id}`, { method: 'DELETE' }),
  },

  workOrders: {
    getAll: (params?: { status?: string; priority?: string }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return fetchAPI(`/work-orders${query ? `?${query}` : ''}`);
    },
    // Similar CRUD methods...
  },

  inventory: {
    getAll: () => fetchAPI('/inventory'),
    // Similar CRUD methods...
  },
};
```

### Error Handling Pattern

```tsx
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const controller = new AbortController();
  setLoading(true);

  api.assets
    .getAll()
    .then((data) => setAssets(data as Asset[]))
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));

  return () => controller.abort();
}, []);

// In JSX:
{error && (
  <InlineNotification kind="error" title="Error" subtitle={error} />
)}
```

---

## Styling & Responsiveness

### Global Styles

**File:** `src/index.css`

```css
/* Root variables using Carbon tokens */
:root {
  --primary-color: #1C6BBA;
  --primary-hover: #155A9D;
  --success-color: #24a148;
  --warning-color: #f1c21b;
  --error-color: #da1e28;
}

/* Reset & Base */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Utility Classes */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-8 {
  gap: 0.5rem;
}

.gap-12 {
  gap: 0.75rem;
}

.mb-16 {
  margin-bottom: 1rem;
}

/* Container */
.container {
  padding: 2rem 3rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .hidden-mobile {
    display: none !important;
  }
  
  /* Hide desktop table, show mobile cards */
  .desktop-table {
    display: none;
  }
  
  .mobile-cards {
    display: block;
  }
}

@media (min-width: 769px) {
  .desktop-table {
    display: table;
  }
  
  .mobile-cards {
    display: none;
  }
}

/* Action Buttons - Primary Blue */
button[type="submit"],
.action-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button[type="submit"]:hover,
.action-button:hover {
  background-color: var(--primary-hover);
}

button[type="submit"]:disabled {
  background-color: #c0c0c0;
  cursor: not-allowed;
}

/* Info Icon Button */
.info-icon-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.info-icon-button:hover {
  opacity: 0.7;
}

/* Mobile Overlay */
.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.mobile-overlay.active {
  display: block;
}
```

### Responsive Breakpoints

- **Mobile**: < 768px
  - Single column layouts
  - Hamburger menu
  - Card views instead of tables
  - Stacked form fields
  
- **Tablet**: 768px - 1024px
  - 2-column grids
  - Side navigation visible
  - Tables with horizontal scroll if needed
  
- **Desktop**: > 1024px
  - Full layout with sidebar
  - 2-column grids
  - Full-width tables

---

## Step-by-Step Implementation

### Phase 1: Project Setup (30 minutes)

1. **Create Vite + React + TypeScript project:**
```bash
npm create vite@latest asset-manager -- --template react-ts
cd asset-manager
npm install
```

2. **Install Carbon Design System:**
```bash
npm install @carbon/react @carbon/icons-react
```

3. **Setup project structure:**
```bash
mkdir -p src/components src/types src/utils
touch src/types/index.ts src/utils/api.ts
```

4. **Configure TypeScript (tsconfig.json):**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Phase 2: Core Infrastructure (1 hour)

1. **Create TypeScript types** (`src/types/index.ts`):
   - Copy all interfaces from the types section above
   
2. **Build API client** (`src/utils/api.ts`):
   - Implement fetchAPI helper
   - Create api object with all endpoints
   
3. **Setup global styles** (`src/index.css`):
   - Import Carbon CSS
   - Add custom CSS variables
   - Add utility classes
   - Add responsive styles

4. **Create main App component** (`src/App.tsx`):
   - Setup state for currentView and mobileMenuOpen
   - Create renderView switch function
   - Add mobile hamburger button
   - Add mobile overlay
   - Implement layout structure

### Phase 3: Navigation (30 minutes)

1. **Create Navigation component**:
   - Fixed sidebar layout
   - 4 navigation buttons with icons
   - Active state highlighting
   - Mobile responsive (slide-in)
   - Props: currentView, onNavigate, mobileMenuOpen

### Phase 4: Dashboard (45 minutes)

1. **Create Dashboard component**:
   - Fetch stats from API
   - Loading state with Carbon Loading
   - Error state with InlineNotification
   - 2-column grid layout
   - 7 stat cards with icons and values
   - Hover effects

### Phase 5: Assets Module (3 hours)

1. **Create AssetsList component**:
   - Header with title + add button (icon only)
   - Search and filter inputs (floating labels)
   - Fetch assets with query params
   - Desktop: Carbon DataTable
   - Mobile: Carbon Tiles
   - Info icon in actions column
   - Click to open detail view

2. **Create AssetDetailView component**:
   - Carbon ComposedModal
   - Display all asset fields
   - 2-column grid layout
   - Format dates and currency
   - Close button

3. **Create AssetFormModal component**:
   - Create/edit mode based on props
   - 13 form fields with floating labels
   - Required field validation
   - Submit to API (POST or PUT)
   - Success callback to refresh list

### Phase 6: Work Orders Module (2 hours)

1. **Create WorkOrdersList component**:
   - Similar structure to AssetsList
   - Status and priority filters
   - Priority/status badges with colors
   - Info icon for detail view

2. **Create WorkOrderDetailView component**:
   - Display WO information
   - Description and completion notes panels
   - Format dates/times
   - Icon for each detail field

### Phase 7: Inventory Module (2 hours)

1. **Create InventoryList component**:
   - No filters (simple list)
   - Low stock detection logic
   - Orange highlighting for low stock
   - Info icon for details

2. **Create InventoryDetailView component**:
   - Stock level cards with visual emphasis
   - Stock status indicator
   - Cost calculations
   - Color coding (blue/orange)

### Phase 8: Polish & Testing (2 hours)

1. **Mobile testing:**
   - Test hamburger menu
   - Test card layouts
   - Test form fields
   - Test modals on small screens

2. **Desktop testing:**
   - Test sidebar navigation
   - Test table layouts
   - Test modal sizing
   - Test hover states

3. **Accessibility:**
   - Add aria-labels to icon buttons
   - Ensure keyboard navigation works
   - Test with screen reader
   - Check color contrast

4. **Performance:**
   - Add loading states
   - Optimize re-renders
   - Add error boundaries
   - Test with large datasets

---

## Key Design Decisions

### Why Info Icons Instead of Edit/View Buttons?

**Rationale:**
- **Cleaner UI**: Reduces visual clutter
- **Consistent pattern**: Same interaction across all modules
- **Mobile-friendly**: Single tap target instead of button group
- **View-first approach**: Emphasizes viewing data over editing
- **Space-efficient**: Especially important on mobile

### Why Floating Labels?

**Rationale:**
- **Modern aesthetic**: Clean, professional appearance
- **Space-efficient**: Label and input in same space
- **Clear affordance**: User knows field is interactive
- **Accessibility**: Label always visible when filled
- **Carbon integration**: Matches Carbon's design philosophy

### Why Left Sidebar Navigation?

**Rationale:**
- **Desktop standard**: Expected pattern for web apps
- **Scalability**: Easy to add more nav items
- **Branding space**: Room for logo and title
- **Mobile adaptable**: Hides cleanly on mobile
- **Focus**: Keeps main content area clean

### Color Scheme Rationale

**Primary Blue (#1C6BBA):**
- Professional and trustworthy
- Good contrast with white backgrounds
- Accessible (meets WCAG AA standards)
- Works well for call-to-action buttons

**Status Colors:**
- Green: Positive states (Active, Completed, Low priority)
- Orange: Warning states (In Progress, High priority, Low stock)
- Red: Critical states (Retired, Cancelled, Critical priority)
- Gray: Neutral states (Open, Medium priority, Inactive)

---

## Testing Checklist

### Functionality Testing

- [ ] Navigation switches between views correctly
- [ ] Dashboard loads and displays stats
- [ ] Assets list loads with pagination/filtering
- [ ] Asset detail view shows all information
- [ ] Asset form creates new assets
- [ ] Asset form edits existing assets
- [ ] Work orders list with filters works
- [ ] Work order detail view displays correctly
- [ ] Inventory list shows items
- [ ] Inventory detail view calculates correctly
- [ ] Low stock detection works
- [ ] All API endpoints return correct data

### Mobile Testing (< 768px)

- [ ] Hamburger menu appears
- [ ] Sidebar slides in/out
- [ ] Overlay appears/closes menu
- [ ] Card layouts display correctly
- [ ] Forms are usable
- [ ] Modals are scrollable
- [ ] Info icons are tappable (44px min)
- [ ] Text is readable
- [ ] No horizontal scrolling

### Desktop Testing (> 768px)

- [ ] Sidebar is always visible
- [ ] Tables display all columns
- [ ] Modals are centered and sized properly
- [ ] Hover effects work
- [ ] Forms layout in columns
- [ ] Stats grid shows 2 columns

### Accessibility Testing

- [ ] All images have alt text
- [ ] All buttons have aria-labels
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Screen reader announces content
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators are visible
- [ ] Form labels are associated with inputs
- [ ] Error messages are announced

### Performance Testing

- [ ] Initial load < 3 seconds
- [ ] List views load < 1 second
- [ ] No unnecessary re-renders
- [ ] Filters/search are responsive
- [ ] Large datasets don't freeze UI
- [ ] Images/icons load efficiently

---

## Common Pitfalls & Solutions

### Issue: Carbon styles not loading
**Solution:** Import `@carbon/react/css/index.css` in main.tsx before your custom CSS

### Issue: Floating labels not working
**Solution:** Ensure input has `placeholder=" "` and use `:not(:placeholder-shown)` selector

### Issue: Mobile menu not closing after navigation
**Solution:** Call `setMobileMenuOpen(false)` in the handleNavigate function

### Issue: Detail modals showing stale data
**Solution:** Set viewing state to null in onClose callback

### Issue: Tables not responsive
**Solution:** Use separate desktop/mobile views with display: none media queries

### Issue: API CORS errors
**Solution:** Configure backend to allow requests from your frontend origin

### Issue: Date formatting inconsistent
**Solution:** Use consistent date formatting functions across components

### Issue: Icons not displaying
**Solution:** Check icon names match Carbon icons exactly (case-sensitive)

---

## Deployment Considerations

### Environment Variables
Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:8000
```

Update api.ts to use:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

### Build Command
```bash
npm run build
```

### Production Checklist
- [ ] Update API_BASE_URL to production backend
- [ ] Remove console.log statements
- [ ] Enable production source maps
- [ ] Test with production build locally
- [ ] Configure proper CORS on backend
- [ ] Setup error tracking (e.g., Sentry)
- [ ] Add analytics if needed

---

## Extension Ideas

### Future Enhancements
1. **Bulk Operations**: Select multiple items and perform actions
2. **Export**: Export tables to CSV/Excel
3. **Advanced Filters**: Date ranges, multi-select filters
4. **Search**: Global search across all modules
5. **Notifications**: Toast notifications for actions
6. **Dark Mode**: Theme toggle
7. **User Authentication**: Login/logout, role-based access
8. **Audit Log**: Track who changed what and when
9. **File Uploads**: Attach documents to assets/work orders
10. **Charts**: Visual analytics on dashboard

---

## Resources

### IBM Carbon Design System
- Documentation: https://carbondesignsystem.com/
- React Components: https://react.carbondesignsystem.com/
- Icons: https://carbondesignsystem.com/guidelines/icons/library
- Design Kit: Figma/Sketch files available

### React + TypeScript
- React Docs: https://react.dev/
- TypeScript Handbook: https://www.typescriptlang.org/docs/

### Vite
- Vite Docs: https://vitejs.dev/

---

## Summary

This guide provides a complete blueprint for recreating the Asset Management UI. The key principles are:

1. **Use IBM Carbon Design System** for consistent, professional UI
2. **Mobile-first responsive design** with hamburger navigation
3. **Info-centric approach** with detail view modals
4. **Clean, minimalist aesthetic** with focus on usability
5. **Consistent patterns** across all modules
6. **Professional color scheme** with blue primary actions
7. **Floating labels** for modern form design
8. **Icon-only action buttons** to reduce clutter

Follow the step-by-step implementation phases, use the provided code examples, and reference this guide throughout development. The resulting application will be a professional, responsive, and user-friendly asset management system.

**Estimated Total Development Time:** 15-20 hours for a skilled developer

Good luck with your recreation!
