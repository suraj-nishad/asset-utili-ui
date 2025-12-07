// Enums
export type AssetStatus = 'Active' | 'Inactive' | 'In Maintenance' | 'Retired';

export type WorkOrderStatus = 'Open' | 'In Progress' | 'Completed' | 'Cancelled';

export type WorkOrderPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type PMFrequencyUnit = 'Days' | 'Hours' | 'Months';

// Location Model
export interface Location {
  id?: number;
  name: string;
  description?: string;
  parent_id?: number;
}

// Asset Model
export interface Asset {
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
  created_at?: string;       // ISO datetime (auto-generated)
  updated_at?: string;       // ISO datetime (auto-generated)
}

// Work Order Model
export interface WorkOrder {
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
  created_at?: string;       // ISO datetime (auto-generated)
  started_at?: string;       // ISO datetime
  completed_at?: string;     // ISO datetime
  pm_template_id?: number;   // If generated from PM template
}

// PM Template Model
export interface PMTemplate {
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
  created_at?: string;              // ISO datetime (auto-generated)
}

// Inventory Item Model
export interface InventoryItem {
  id?: number;
  item_name: string;
  part_number: string;       // Unique
  description?: string;
  stock_on_hand: number;     // Default: 0
  min_stock: number;         // Default: 0
  max_stock?: number;
  unit_cost?: number;
  created_at?: string;       // ISO datetime (auto-generated)
  updated_at?: string;       // ISO datetime (auto-generated)
}

// Dashboard Stats Model
export interface DashboardStats {
  total_assets: number;
  active_assets: number;
  total_work_orders: number;
  open_work_orders: number;
  in_progress_work_orders: number;
  low_stock_items: number;
  due_pms_next_7_days: number;
}
