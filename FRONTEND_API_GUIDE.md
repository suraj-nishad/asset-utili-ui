# Asset Manager - Frontend API Guide

**Base URL:** `http://localhost:8003`

**Version:** 1.0.0

**Date:** December 6, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Data Models](#data-models)
6. [API Endpoints](#api-endpoints)
   - [Locations](#locations)
   - [Assets](#assets)
   - [Work Orders](#work-orders)
   - [Preventive Maintenance](#preventive-maintenance)
   - [Inventory](#inventory)
   - [Dashboard/Stats](#dashboard-stats)

---

## Overview

This API provides comprehensive asset management functionality including:
- Asset Registry with location tracking
- Work Order management
- Preventive Maintenance scheduling
- Basic inventory management
- Dashboard statistics

All endpoints return JSON responses. The API uses REST conventions with standard HTTP methods.

---

## Authentication

Currently, no authentication is required. CORS is enabled for all origins.

---

## Response Format

### Success Response
```json
{
  "id": 1,
  "name": "Asset Name",
  ...
}
```

For list endpoints:
```json
[
  { "id": 1, "name": "Item 1" },
  { "id": 2, "name": "Item 2" }
]
```

### Error Response
```json
{
  "detail": "Error message description"
}
```

---

## Error Handling

| Status Code | Meaning |
|------------|---------|
| 200 | Success |
| 404 | Resource not found |
| 422 | Validation error (invalid input) |
| 500 | Internal server error |

---

## Data Models

### Enums

#### AssetStatus
- `Active`
- `Inactive`
- `In Maintenance`
- `Retired`

#### WorkOrderStatus
- `Open`
- `In Progress`
- `Completed`
- `Cancelled`

#### WorkOrderPriority
- `Low`
- `Medium`
- `High`
- `Critical`

#### PMFrequencyUnit
- `Days`
- `Hours`
- `Months`

### Location Model
```typescript
{
  id?: number;
  name: string;
  description?: string;
  parent_id?: number;
}
```

### Asset Model
```typescript
{
  id?: number;
  asset_id: string;          // Unique custom asset ID
  name: string;
  category: string;
  status: AssetStatus;       // Default: "Active"
  location_id?: number;
  owner_cost_center?: string;
  vendor?: string;
  serial_number?: string;
  tag_id?: string;
  purchase_date?: string;    // ISO date format: "2025-01-15"
  warranty_expiry?: string;  // ISO date format
  purchase_cost?: number;
  meter_reading?: number;
  notes?: string;
  created_at: string;        // ISO datetime (auto-generated)
  updated_at: string;        // ISO datetime (auto-generated)
}
```

### Work Order Model
```typescript
{
  id?: number;
  wo_number: string;         // Unique work order number
  summary: string;
  description?: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;   // Default: "Open"
  technician?: string;
  due_date?: string;         // ISO datetime
  time_spent_hours: number;  // Default: 0.0
  completion_notes?: string;
  created_at: string;        // ISO datetime (auto-generated)
  started_at?: string;       // ISO datetime
  completed_at?: string;     // ISO datetime
  pm_template_id?: number;   // If generated from PM template
}
```

### PM Template Model
```typescript
{
  id?: number;
  name: string;
  description?: string;
  frequency_value: number;
  frequency_unit: PMFrequencyUnit;
  asset_id: number;
  last_generated_date?: string;     // ISO datetime
  next_due_date?: string;           // ISO datetime (auto-calculated)
  is_active: boolean;               // Default: true
  wo_summary_template: string;
  wo_description_template?: string;
  default_priority: WorkOrderPriority;
  created_at: string;               // ISO datetime (auto-generated)
}
```

### Inventory Item Model
```typescript
{
  id?: number;
  item_name: string;
  part_number: string;       // Unique
  description?: string;
  stock_on_hand: number;     // Default: 0
  min_stock: number;         // Default: 0
  max_stock?: number;
  unit_cost?: number;
  created_at: string;        // ISO datetime (auto-generated)
  updated_at: string;        // ISO datetime (auto-generated)
}
```

---

## API Endpoints

## Locations

### Get All Locations
```
GET /locations
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Building A",
    "description": "Main production facility",
    "parent_id": null
  }
]
```

### Get Location by ID
```
GET /locations/{location_id}
```

**Response:** Single location object

### Create Location
```
POST /locations
Content-Type: application/json

{
  "name": "Building A",
  "description": "Main production facility",
  "parent_id": null
}
```

**Response:** Created location object with `id`

### Update Location
```
PUT /locations/{location_id}
Content-Type: application/json

{
  "name": "Building A - Updated",
  "description": "Updated description"
}
```

**Response:** Updated location object

### Delete Location
```
DELETE /locations/{location_id}
```

**Response:** `{"message": "Location deleted successfully"}`

---

## Assets

### Get All Assets
```
GET /assets?status={status}&category={category}&search={query}
```

**Query Parameters:**
- `status` (optional): Filter by AssetStatus (`Active`, `Inactive`, etc.)
- `category` (optional): Filter by category string
- `search` (optional): Search in name, asset_id, or serial_number

**Response:**
```json
[
  {
    "id": 1,
    "asset_id": "PUMP-001",
    "name": "Hydraulic Pump",
    "category": "Pumps",
    "status": "Active",
    "location_id": 1,
    "owner_cost_center": "PROD-001",
    "vendor": "Acme Industrial",
    "serial_number": "SN-12345",
    "tag_id": "TAG-001",
    "purchase_date": "2023-01-15",
    "warranty_expiry": "2026-01-15",
    "purchase_cost": 15000.00,
    "meter_reading": 1000.0,
    "notes": "Primary production pump",
    "created_at": "2025-12-06T10:30:00",
    "updated_at": "2025-12-06T10:30:00"
  }
]
```

### Get Asset by ID
```
GET /assets/{asset_id}
```

**Response:** Single asset object

### Create Asset
```
POST /assets
Content-Type: application/json

{
  "asset_id": "PUMP-001",
  "name": "Hydraulic Pump",
  "category": "Pumps",
  "status": "Active",
  "location_id": 1,
  "owner_cost_center": "PROD-001",
  "vendor": "Acme Industrial",
  "serial_number": "SN-12345",
  "purchase_cost": 15000.00,
  "meter_reading": 1000.0
}
```

**Response:** Created asset object with `id`

### Update Asset
```
PUT /assets/{asset_id}
Content-Type: application/json

{
  "asset_id": "PUMP-001",
  "name": "Hydraulic Pump - Updated",
  "status": "In Maintenance",
  "notes": "Currently under maintenance"
}
```

**Response:** Updated asset object

### Delete Asset
```
DELETE /assets/{asset_id}
```

**Response:** `{"message": "Asset deleted successfully"}`

### Retire Asset
```
PATCH /assets/{asset_id}/retire
```

Sets asset status to "Retired".

**Response:** Updated asset object

### Bulk Import Assets (CSV)
```
POST /assets/bulk-import
Content-Type: multipart/form-data

file: <CSV file>
```

**CSV Format:**
```csv
asset_id,name,category,status,location_id,owner_cost_center,vendor,serial_number,purchase_cost
PUMP-001,Hydraulic Pump,Pumps,Active,1,PROD-001,Acme,SN-12345,15000.00
```

**Response:**
```json
{
  "imported": 10,
  "failed": 0,
  "errors": []
}
```

---

## Work Orders

### Get All Work Orders
```
GET /work-orders?status={status}&priority={priority}&technician={name}
```

**Query Parameters:**
- `status` (optional): Filter by WorkOrderStatus
- `priority` (optional): Filter by WorkOrderPriority
- `technician` (optional): Filter by technician name

**Response:**
```json
[
  {
    "id": 1,
    "wo_number": "WO-2025-001",
    "summary": "Replace pump seal",
    "description": "Seal is leaking, needs immediate replacement",
    "priority": "High",
    "status": "Open",
    "technician": "John Smith",
    "due_date": "2025-12-10T12:00:00",
    "time_spent_hours": 0.0,
    "completion_notes": null,
    "created_at": "2025-12-06T10:00:00",
    "started_at": null,
    "completed_at": null,
    "pm_template_id": null
  }
]
```

### Get Work Order by ID
```
GET /work-orders/{wo_id}
```

**Response:** Single work order object

### Create Work Order
```
POST /work-orders?asset_ids=1&asset_ids=2
Content-Type: application/json

{
  "wo_number": "WO-2025-001",
  "summary": "Replace pump seal",
  "description": "Seal is leaking",
  "priority": "High",
  "status": "Open",
  "technician": "John Smith",
  "due_date": "2025-12-10T12:00:00"
}
```

**Query Parameters:**
- `asset_ids` (optional, multiple): Link assets to this work order

**Response:** Created work order object with `id`

### Update Work Order
```
PUT /work-orders/{wo_id}
Content-Type: application/json

{
  "status": "In Progress",
  "technician": "Jane Doe",
  "started_at": "2025-12-06T14:00:00"
}
```

**Response:** Updated work order object

### Complete Work Order
```
PATCH /work-orders/{wo_id}/complete
Content-Type: application/json

{
  "completion_notes": "Replaced seal, tested successfully",
  "time_spent_hours": 2.5
}
```

Sets status to "Completed" and auto-deducts parts from inventory.

**Response:** Updated work order object

### Start Work Order
```
PATCH /work-orders/{wo_id}/start
```

Sets status to "In Progress" and records started_at timestamp.

**Response:** Updated work order object

### Cancel Work Order
```
PATCH /work-orders/{wo_id}/cancel
```

Sets status to "Cancelled".

**Response:** Updated work order object

### Delete Work Order
```
DELETE /work-orders/{wo_id}
```

**Response:** `{"message": "Work order deleted successfully"}`

### Add Parts to Work Order
```
POST /work-orders/{wo_id}/parts?inventory_item_id={item_id}&quantity={qty}
```

Links inventory items to work order. Parts are deducted from inventory when WO is completed.

**Query Parameters:**
- `inventory_item_id`: ID of inventory item
- `quantity`: Quantity to use (default: 1)

**Response:** Work order object with parts information

### Get Assets Linked to Work Order
```
GET /work-orders/{wo_id}/assets
```

**Response:**
```json
[
  {
    "id": 1,
    "asset_id": "PUMP-001",
    "name": "Hydraulic Pump",
    ...
  }
]
```

---

## Preventive Maintenance

### Get All PM Templates
```
GET /pm-templates?asset_id={id}&is_active={boolean}
```

**Query Parameters:**
- `asset_id` (optional): Filter by asset
- `is_active` (optional): Filter by active status (true/false)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Quarterly Pump Inspection",
    "description": "Regular quarterly inspection",
    "frequency_value": 90,
    "frequency_unit": "Days",
    "asset_id": 1,
    "last_generated_date": "2025-09-06T10:00:00",
    "next_due_date": "2025-12-06T10:00:00",
    "is_active": true,
    "wo_summary_template": "Quarterly Inspection - {asset_name}",
    "wo_description_template": "Perform routine inspection",
    "default_priority": "Medium",
    "created_at": "2025-01-01T10:00:00"
  }
]
```

### Get PM Template by ID
```
GET /pm-templates/{template_id}
```

**Response:** Single PM template object

### Create PM Template
```
POST /pm-templates
Content-Type: application/json

{
  "name": "Quarterly Pump Inspection",
  "description": "Regular inspection every 90 days",
  "frequency_value": 90,
  "frequency_unit": "Days",
  "asset_id": 1,
  "is_active": true,
  "wo_summary_template": "Quarterly Inspection",
  "wo_description_template": "Perform routine inspection",
  "default_priority": "Medium"
}
```

**Response:** Created PM template with auto-calculated `next_due_date`

### Update PM Template
```
PUT /pm-templates/{template_id}
Content-Type: application/json

{
  "frequency_value": 60,
  "is_active": false
}
```

**Response:** Updated PM template object

### Delete PM Template
```
DELETE /pm-templates/{template_id}
```

**Response:** `{"message": "PM template deleted successfully"}`

### Get Due Soon PM Templates
```
GET /pm-templates/due-soon?days={number}
```

Returns PM templates due within specified days.

**Query Parameters:**
- `days` (optional): Number of days ahead to check (default: 7)

**Response:** Array of PM template objects

### Generate Work Order from PM Template
```
POST /pm-templates/{template_id}/generate-wo
```

Creates a work order from the PM template and updates the template's next_due_date.

**Response:** Newly created work order object

---

## Inventory

### Get All Inventory Items
```
GET /inventory?low_stock={boolean}
```

**Query Parameters:**
- `low_stock` (optional): If true, returns only items at or below min_stock

**Response:**
```json
[
  {
    "id": 1,
    "item_name": "Hydraulic Oil Filter",
    "part_number": "HF-12345",
    "description": "Standard hydraulic filter",
    "stock_on_hand": 50,
    "min_stock": 10,
    "max_stock": 100,
    "unit_cost": 25.50,
    "created_at": "2025-12-06T10:00:00",
    "updated_at": "2025-12-06T10:00:00"
  }
]
```

### Get Inventory Item by ID
```
GET /inventory/{item_id}
```

**Response:** Single inventory item object

### Create Inventory Item
```
POST /inventory
Content-Type: application/json

{
  "item_name": "Hydraulic Oil Filter",
  "part_number": "HF-12345",
  "description": "Standard hydraulic filter",
  "stock_on_hand": 50,
  "min_stock": 10,
  "max_stock": 100,
  "unit_cost": 25.50
}
```

**Response:** Created inventory item with `id`

### Update Inventory Item
```
PUT /inventory/{item_id}
Content-Type: application/json

{
  "stock_on_hand": 45,
  "unit_cost": 26.00
}
```

**Response:** Updated inventory item object

### Delete Inventory Item
```
DELETE /inventory/{item_id}
```

**Response:** `{"message": "Inventory item deleted successfully"}`

### Adjust Inventory Stock
```
PATCH /inventory/{item_id}/adjust?quantity={amount}
```

Adjusts stock quantity (positive to add, negative to subtract).

**Query Parameters:**
- `quantity`: Amount to adjust (can be negative)

**Response:** Updated inventory item object

---

## Dashboard Stats

### Get Dashboard Statistics
```
GET /stats/dashboard
```

Returns comprehensive statistics for dashboard display.

**Response:**
```json
{
  "total_assets": 150,
  "active_assets": 120,
  "total_work_orders": 45,
  "open_work_orders": 12,
  "in_progress_work_orders": 8,
  "low_stock_items": 5,
  "pm_due_soon": 3
}
```

**Calculated Fields:**
- `total_assets`: All assets in system
- `active_assets`: Assets with status "Active"
- `total_work_orders`: All work orders
- `open_work_orders`: Work orders with status "Open"
- `in_progress_work_orders`: Work orders with status "In Progress"
- `low_stock_items`: Inventory items at or below min_stock
- `pm_due_soon`: PM templates due within 7 days

---

## Common Frontend Patterns

### Loading Assets for Dropdown
```javascript
async function loadAssets() {
  const response = await fetch('http://localhost:8003/assets?status=Active');
  const assets = await response.json();
  return assets;
}
```

### Creating a Work Order with Assets
```javascript
async function createWorkOrder(woData, assetIds) {
  const queryParams = assetIds.map(id => `asset_ids=${id}`).join('&');
  const response = await fetch(
    `http://localhost:8003/work-orders?${queryParams}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(woData)
    }
  );
  return await response.json();
}
```

### Filtering Assets
```javascript
async function searchAssets(searchTerm, status, category) {
  const params = new URLSearchParams();
  if (searchTerm) params.append('search', searchTerm);
  if (status) params.append('status', status);
  if (category) params.append('category', category);
  
  const response = await fetch(`http://localhost:8003/assets?${params}`);
  return await response.json();
}
```

### Handling Errors
```javascript
async function handleRequest(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Request failed');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### Loading Dashboard Stats
```javascript
async function loadDashboard() {
  const response = await fetch('http://localhost:8003/stats/dashboard');
  const stats = await response.json();
  
  // Update UI
  document.getElementById('total-assets').textContent = stats.total_assets;
  document.getElementById('open-wos').textContent = stats.open_work_orders;
  // ... etc
}
```

---

## TypeScript Types

Here's a complete TypeScript definition file you can use:

```typescript
// types/api.ts

export enum AssetStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  IN_MAINTENANCE = "In Maintenance",
  RETIRED = "Retired"
}

export enum WorkOrderStatus {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled"
}

export enum WorkOrderPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical"
}

export enum PMFrequencyUnit {
  DAYS = "Days",
  HOURS = "Hours",
  MONTHS = "Months"
}

export interface Location {
  id?: number;
  name: string;
  description?: string;
  parent_id?: number;
}

export interface Asset {
  id?: number;
  asset_id: string;
  name: string;
  category: string;
  status: AssetStatus;
  location_id?: number;
  owner_cost_center?: string;
  vendor?: string;
  serial_number?: string;
  tag_id?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  purchase_cost?: number;
  meter_reading?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkOrder {
  id?: number;
  wo_number: string;
  summary: string;
  description?: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  technician?: string;
  due_date?: string;
  time_spent_hours: number;
  completion_notes?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  pm_template_id?: number;
}

export interface PMTemplate {
  id?: number;
  name: string;
  description?: string;
  frequency_value: number;
  frequency_unit: PMFrequencyUnit;
  asset_id: number;
  last_generated_date?: string;
  next_due_date?: string;
  is_active: boolean;
  wo_summary_template: string;
  wo_description_template?: string;
  default_priority: WorkOrderPriority;
  created_at: string;
}

export interface InventoryItem {
  id?: number;
  item_name: string;
  part_number: string;
  description?: string;
  stock_on_hand: number;
  min_stock: number;
  max_stock?: number;
  unit_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_assets: number;
  active_assets: number;
  total_work_orders: number;
  open_work_orders: number;
  in_progress_work_orders: number;
  low_stock_items: number;
  pm_due_soon: number;
}

export interface BulkImportResult {
  imported: number;
  failed: number;
  errors: string[];
}
```

---

## React/Vue Component Examples

### React Hook for Assets
```typescript
import { useState, useEffect } from 'react';
import { Asset } from './types/api';

export function useAssets(status?: string) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const url = status 
          ? `http://localhost:8003/assets?status=${status}`
          : 'http://localhost:8003/assets';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch assets');
        const data = await response.json();
        setAssets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchAssets();
  }, [status]);

  return { assets, loading, error };
}
```

### Vue Composable for Work Orders
```typescript
import { ref, onMounted } from 'vue';
import type { WorkOrder } from './types/api';

export function useWorkOrders() {
  const workOrders = ref<WorkOrder[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  async function fetchWorkOrders(status?: string) {
    loading.value = true;
    try {
      const url = status
        ? `http://localhost:8003/work-orders?status=${status}`
        : 'http://localhost:8003/work-orders';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch work orders');
      workOrders.value = await response.json();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => fetchWorkOrders());

  return { workOrders, loading, error, fetchWorkOrders };
}
```

---

## Testing the API

You can test the API using curl, Postman, or the browser:

```bash
# Get all assets
curl http://localhost:8003/assets

# Create a location
curl -X POST http://localhost:8003/locations \
  -H "Content-Type: application/json" \
  -d '{"name":"Building A","description":"Main facility"}'

# Get dashboard stats
curl http://localhost:8003/stats/dashboard

# Filter work orders
curl "http://localhost:8003/work-orders?status=Open&priority=High"
```

---

## Notes for Frontend Development

1. **Date Handling**: All dates are in ISO format. Use `new Date(dateString)` or moment.js/day.js for parsing.

2. **Enums**: Use exact strings as shown (case-sensitive). For dropdowns, display the enum values directly.

3. **IDs**: When creating new records, don't include `id` field. It's auto-generated.

4. **Timestamps**: `created_at` and `updated_at` are auto-managed by the backend.

5. **Relationships**: When creating work orders with assets, use query parameters for `asset_ids`.

6. **CSV Import**: Use FormData to upload CSV files for bulk import.

7. **Filtering**: All filter parameters are optional. Combine them as needed.

8. **Search**: The search endpoint searches across multiple fields (name, asset_id, serial_number).

9. **Status Updates**: Use dedicated endpoints (complete, start, cancel, retire) for status changes.

10. **Error Messages**: Always check response status and display `detail` field to users.

---

## Next Steps

1. Set up API client/service layer in your frontend
2. Create TypeScript interfaces/types
3. Implement error handling and loading states
4. Add form validation matching API requirements
5. Test all CRUD operations
6. Implement real-time updates if needed (consider WebSockets or polling)

---

**Questions or Issues?**  
Check the backend logs for detailed error information. The API logs all SQL queries when running with `echo=True`.
