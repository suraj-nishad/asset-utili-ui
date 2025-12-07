import { useEffect, useState } from 'react';
import {
  Loading,
  InlineNotification,
  Tag,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tile,
} from '@carbon/react';
import { TaskComplete, AddAlt, Information } from '@carbon/icons-react';
import { api } from '../utils/api';
import type { WorkOrder } from '../types';
import WorkOrderDetailView from './WorkOrderDetailView';
import './WorkOrdersList.css';

const WorkOrdersList = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [viewingWorkOrder, setViewingWorkOrder] = useState<WorkOrder | null>(null);

  const fetchWorkOrders = () => {
    setLoading(true);
    api.workOrders
      .getAll()
      .then((data) => {
        setWorkOrders(data);
        setFilteredWorkOrders(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  useEffect(() => {
    let filtered = [...workOrders];

    if (statusFilter) {
      filtered = filtered.filter((wo) => wo.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter((wo) => wo.priority === priorityFilter);
    }

    setFilteredWorkOrders(filtered);
  }, [statusFilter, priorityFilter, workOrders]);

  const getPriorityTagType = (priority: string): 'red' | 'warm-gray' | 'magenta' | 'green' => {
    switch (priority) {
      case 'Critical':
        return 'red';
      case 'High':
        return 'magenta';
      case 'Low':
        return 'green';
      default:
        return 'warm-gray';
    }
  };

  const getStatusTagType = (status: string): 'green' | 'gray' | 'red' | 'blue' => {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'In Progress':
        return 'blue';
      case 'Cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleViewDetails = (workOrder: WorkOrder) => {
    setViewingWorkOrder(workOrder);
    setIsDetailViewOpen(true);
  };

  const handleCloseDetailView = () => {
    setIsDetailViewOpen(false);
    setViewingWorkOrder(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loading description="Loading work orders..." withOverlay={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            lowContrast
          />
        </div>
      </div>
    );
  }

  const headers = [
    { key: 'wo_number', header: 'WO Number' },
    { key: 'summary', header: 'Summary' },
    { key: 'priority', header: 'Priority' },
    { key: 'status', header: 'Status' },
    { key: 'technician', header: 'Technician' },
    { key: 'due_date', header: 'Due Date' },
    { key: 'time_spent_hours', header: 'Time Spent (hrs)' },
    { key: 'actions', header: 'Actions' },
  ];

  const rows = filteredWorkOrders.map((wo) => ({
    id: wo.id?.toString() || '',
    wo_number: wo.wo_number,
    summary: wo.summary,
    priority: wo.priority,
    status: wo.status,
    technician: wo.technician || '-',
    due_date: formatDate(wo.due_date),
    time_spent_hours: wo.time_spent_hours.toFixed(1),
    actions: wo,
  }));

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-24">
        <div className="flex items-center gap-12">
          <TaskComplete size={32} />
          <h1 className="heading-1">Work Orders</h1>
        </div>
        <button
          className="icon-button"
          onClick={() => alert('Create Work Order - Coming Soon')}
          aria-label="Add New Work Order"
        >
          <AddAlt size={32} />
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section mb-24">
        <div className="input-group">
          <select
            id="status-filter"
            className="select-floating"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <label htmlFor="status-filter" className="label-floating">
            Status
          </label>
        </div>

        <div className="input-group">
          <select
            id="priority-filter"
            className="select-floating"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <label htmlFor="priority-filter" className="label-floating">
            Priority
          </label>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="desktop-table">
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })} key={header.key}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const wo = filteredWorkOrders.find((w) => w.id?.toString() === row.id);
                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell) => {
                          if (cell.info.header === 'priority') {
                            return (
                              <TableCell key={cell.id}>
                                <Tag type={getPriorityTagType(cell.value)}>
                                  {cell.value}
                                </Tag>
                              </TableCell>
                            );
                          }
                          if (cell.info.header === 'status') {
                            return (
                              <TableCell key={cell.id}>
                                <Tag type={getStatusTagType(cell.value)}>
                                  {cell.value}
                                </Tag>
                              </TableCell>
                            );
                          }
                          if (cell.info.header === 'actions') {
                            return (
                              <TableCell key={cell.id}>
                                <button
                                  className="icon-button"
                                  onClick={() => wo && handleViewDetails(wo)}
                                  aria-label="View details"
                                >
                                  <Information size={24} />
                                </button>
                              </TableCell>
                            );
                          }
                          return <TableCell key={cell.id}>{cell.value}</TableCell>;
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards">
        {filteredWorkOrders.map((wo) => (
          <Tile key={wo.id} className="wo-card">
            <div className="flex justify-between items-start mb-12">
              <div className="flex-grow">
                <div className="font-medium text-gray">{wo.wo_number}</div>
                <div className="heading-3 mt-4">{wo.summary}</div>
              </div>
              <button
                className="icon-button"
                onClick={() => handleViewDetails(wo)}
                aria-label="View details"
              >
                <Information size={24} />
              </button>
            </div>
            <div className="wo-badges mb-12">
              <Tag type={getPriorityTagType(wo.priority)}>{wo.priority}</Tag>
              <Tag type={getStatusTagType(wo.status)}>{wo.status}</Tag>
            </div>
            <div className="wo-details">
              {wo.technician && (
                <div className="detail-row">
                  <span className="detail-label">Technician:</span>
                  <span>{wo.technician}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Due Date:</span>
                <span>{formatDate(wo.due_date)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time Spent:</span>
                <span>{wo.time_spent_hours.toFixed(1)} hrs</span>
              </div>
            </div>
          </Tile>
        ))}
      </div>

      {filteredWorkOrders.length === 0 && (
        <div className="empty-state">
          <p>No work orders found matching your criteria.</p>
        </div>
      )}

      {/* Detail Modal */}
      {viewingWorkOrder && (
        <WorkOrderDetailView
          workOrder={viewingWorkOrder}
          isOpen={isDetailViewOpen}
          onClose={handleCloseDetailView}
        />
      )}
    </div>
  );
};

export default WorkOrdersList;
