import type { Asset, WorkOrder, InventoryItem, DashboardStats, Location, PMTemplate } from '../types';

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
  // Dashboard
  dashboard: {
    getStats: () => fetchAPI<DashboardStats>('/stats/dashboard'),
  },

  // Locations
  locations: {
    getAll: () => fetchAPI<Location[]>('/locations'),
    getById: (id: number) => fetchAPI<Location>(`/locations/${id}`),
    create: (data: Location) => fetchAPI<Location>('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: Location) => fetchAPI<Location>(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchAPI<void>(`/locations/${id}`, { method: 'DELETE' }),
  },

  // Assets
  assets: {
    getAll: (params?: { status?: string; category?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.category) query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      const queryString = query.toString();
      return fetchAPI<Asset[]>(`/assets${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id: number) => fetchAPI<Asset>(`/assets/${id}`),
    create: (data: Asset) => fetchAPI<Asset>('/assets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: Asset) => fetchAPI<Asset>(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchAPI<void>(`/assets/${id}`, { method: 'DELETE' }),
  },

  // Work Orders
  workOrders: {
    getAll: (params?: { status?: string; priority?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.priority) query.append('priority', params.priority);
      const queryString = query.toString();
      return fetchAPI<WorkOrder[]>(`/work-orders${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id: number) => fetchAPI<WorkOrder>(`/work-orders/${id}`),
    create: (data: WorkOrder) => fetchAPI<WorkOrder>('/work-orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: WorkOrder) => fetchAPI<WorkOrder>(`/work-orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchAPI<void>(`/work-orders/${id}`, { method: 'DELETE' }),
  },

  // Preventive Maintenance Templates
  pmTemplates: {
    getAll: () => fetchAPI<PMTemplate[]>('/pm-templates'),
    getById: (id: number) => fetchAPI<PMTemplate>(`/pm-templates/${id}`),
    create: (data: PMTemplate) => fetchAPI<PMTemplate>('/pm-templates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: PMTemplate) => fetchAPI<PMTemplate>(`/pm-templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchAPI<void>(`/pm-templates/${id}`, { method: 'DELETE' }),
    generateWorkOrders: () => fetchAPI<{ generated_count: number }>('/pm-templates/generate-work-orders', {
      method: 'POST',
    }),
  },

  // Inventory
  inventory: {
    getAll: () => fetchAPI<InventoryItem[]>('/inventory'),
    getById: (id: number) => fetchAPI<InventoryItem>(`/inventory/${id}`),
    create: (data: InventoryItem) => fetchAPI<InventoryItem>('/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: InventoryItem) => fetchAPI<InventoryItem>(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => fetchAPI<void>(`/inventory/${id}`, { method: 'DELETE' }),
  },
};
