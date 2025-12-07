# Asset Manager UI

A modern, responsive Asset Management System built with React, TypeScript, and IBM Carbon Design System.

## 🚀 Features

### Core Modules

1. **Dashboard**
   - Real-time statistics display
   - 7 KPI cards showing:
     - Total & Active Assets
     - Work Order metrics (Total, Open, In Progress)
     - Low Stock Items count
     - Preventive Maintenance due in next 7 days

2. **Assets Management**
   - Complete CRUD operations
   - Search and filter by status/category
   - Desktop: DataTable view
   - Mobile: Responsive card layout
   - Detail view modal with all asset information
   - Form modal for creating/editing assets

3. **Work Orders**
   - Status and priority filtering
   - Color-coded priority/status badges
   - Detail view with timeline information
   - Time tracking display

4. **Inventory**
   - Low stock detection and highlighting
   - Stock level visualization
   - Cost calculations (unit cost & total value)
   - Visual stock status indicators

### Design Features

- **Mobile-First Design**: Fully responsive with hamburger menu navigation
- **IBM Carbon Design System**: Professional, accessible UI components
- **Floating Label Forms**: Modern form input pattern
- **Info-Centric Approach**: View-first with info icon interactions
- **Custom Color Scheme**: Primary blue (#1C6BBA) for actions

## 🛠️ Tech Stack

- **React 19.2** - UI library
- **TypeScript ~5.9.3** - Type safety
- **Vite 7.2.4** - Build tool & dev server
- **IBM Carbon Design System** - UI component library
- **Carbon Icons React** - Icon library
- **ESLint** - Code linting with React Hooks & Refresh plugins

## 📋 Prerequisites

- Node.js 18+ recommended
- Backend API running at `http://localhost:8003` (see `FRONTEND_API_GUIDE.md`)

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will open at `http://localhost:5173` (or next available port).

### Build

```bash
# Build for production
npm run build
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.tsx           # Sidebar navigation
│   ├── Dashboard.tsx            # Dashboard with stats cards
│   ├── AssetsList.tsx           # Assets list view
│   ├── AssetDetailView.tsx      # Asset detail modal
│   ├── AssetFormModal.tsx       # Asset create/edit form
│   ├── WorkOrdersList.tsx       # Work orders list
│   ├── WorkOrderDetailView.tsx  # WO detail modal
│   ├── InventoryList.tsx        # Inventory list
│   └── InventoryDetailView.tsx  # Inventory detail modal
├── types/
│   └── index.ts         # TypeScript interfaces
├── utils/
│   └── api.ts           # API client functions
├── App.tsx              # Main app with view switching
├── main.tsx             # React entry point
└── index.css            # Global styles
```

## 🎨 Design System

### Color Palette

- **Primary Action**: `#1C6BBA` - Buttons, links, active states
- **Success**: `#24a148` - Active, Completed, Low priority
- **Warning**: `#f1c21b` - In Progress, High priority, Low stock
- **Error**: `#da1e28` - Critical, Retired, Cancelled
- **Neutral**: `#8d8d8d` - Open, Medium priority

### Responsive Breakpoints

- **Mobile**: < 768px - Hamburger menu, card views
- **Desktop**: ≥ 768px - Fixed sidebar, table views

### Key Patterns

1. **Floating Labels**: All form inputs use floating label pattern
2. **Info Icons**: Single info button (24px) in action columns
3. **Status Badges**: Color-coded Carbon Tags for status/priority
4. **Loading States**: Carbon Loading component
5. **Error States**: Carbon InlineNotification component

## 🔌 API Integration

API client in `src/utils/api.ts` connects to backend at `http://localhost:8003`.

### Main Endpoints

- `GET /stats/dashboard` - Dashboard statistics
- `GET/POST/PUT/DELETE /assets` - Asset CRUD operations
- `GET/POST/PUT/DELETE /work-orders` - Work order operations
- `GET/POST/PUT/DELETE /inventory` - Inventory management
- `GET /locations` - Location data
- `GET /pm-templates` - Preventive maintenance templates

See `FRONTEND_API_GUIDE.md` for complete API documentation.

## 📱 Mobile Experience

- Hamburger menu button (top-left)
- Slide-in navigation sidebar
- Overlay background when menu open
- Card-based layouts instead of tables
- Touch-optimized button sizes (min 44px)
- Stacked form layouts

## 🧪 Development Notes

### TypeScript Configuration

- Strict mode enabled
- Bundler module resolution
- React JSX transform
- No unused locals/parameters warnings

### ESLint Configuration

- Flat config format
- TypeScript ESLint integration
- React Hooks rules
- React Refresh plugin for HMR

### Carbon Integration

Import Carbon styles in `main.tsx`:
```typescript
import '@carbon/react/index.scss'
```

Custom overrides in `index.css` loaded AFTER Carbon CSS.

## 📚 Documentation

- **RECREATION_GUIDE.md** - Complete component specifications & implementation guide
- **FRONTEND_API_GUIDE.md** - API endpoints, request/response formats
- **openapi.json** - OpenAPI specification
- **.github/copilot-instructions.md** - AI coding agent instructions

## 🤝 Contributing

1. Follow existing code patterns
2. Use Carbon components (no custom UI from scratch)
3. Maintain floating label pattern for forms
4. Add TypeScript types for new features
5. Test responsive layouts on mobile & desktop
6. Run ESLint before committing

## 📝 License

This project is private and proprietary.

## 🆘 Support

For API issues, refer to `FRONTEND_API_GUIDE.md`.
For UI patterns, refer to `RECREATION_GUIDE.md`.

---

**Built with ❤️ using React + TypeScript + Carbon Design System**
