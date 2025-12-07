import { Modal } from '@carbon/react';
import { Information, Close, User, Calendar, Time } from '@carbon/icons-react';
import type { WorkOrder } from '../types';
import './WorkOrderDetailView.css';

interface WorkOrderDetailViewProps {
  workOrder: WorkOrder;
  isOpen: boolean;
  onClose: () => void;
}

const WorkOrderDetailView = ({ workOrder, isOpen, onClose }: WorkOrderDetailViewProps) => {
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return '#da1e28';
      case 'High':
        return '#f1c21b';
      case 'Medium':
        return '#8d8d8d';
      default:
        return '#24a148';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#24a148';
      case 'In Progress':
        return '#1C6BBA';
      case 'Cancelled':
        return '#da1e28';
      default:
        return '#8d8d8d';
    }
  };

  return (
    <Modal
      open={isOpen}
      onRequestClose={onClose}
      modalHeading=""
      passiveModal
      size="lg"
    >
      <div className="detail-modal">
        <div className="detail-header">
          <div className="flex items-center gap-12">
            <Information size={28} />
            <h2 className="heading-2">Work Order Details</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <Close size={24} />
          </button>
        </div>

        <div className="detail-content">
          {/* Main Info */}
          <div className="detail-main-info">
            <div className="detail-asset-id">{workOrder.wo_number}</div>
            <div className="heading-2 mb-12">{workOrder.summary}</div>
            <div className="flex gap-8">
              <div
                className="status-badge"
                style={{ backgroundColor: getPriorityColor(workOrder.priority) }}
              >
                {workOrder.priority} Priority
              </div>
              <div
                className="status-badge"
                style={{ backgroundColor: getStatusColor(workOrder.status) }}
              >
                {workOrder.status}
              </div>
            </div>
          </div>

          {/* Description */}
          {workOrder.description && (
            <div className="detail-notes mb-24">
              <div className="detail-field-label mb-8">Description</div>
              <div className="notes-panel">{workOrder.description}</div>
            </div>
          )}

          {/* Details Grid */}
          <div className="detail-grid">
            {workOrder.technician && (
              <div className="detail-field">
                <div className="flex items-center gap-8 mb-4">
                  <User size={16} />
                  <div className="detail-field-label">Technician</div>
                </div>
                <div className="detail-field-value">{workOrder.technician}</div>
              </div>
            )}

            <div className="detail-field">
              <div className="flex items-center gap-8 mb-4">
                <Calendar size={16} />
                <div className="detail-field-label">Due Date</div>
              </div>
              <div className="detail-field-value">{formatDate(workOrder.due_date)}</div>
            </div>

            <div className="detail-field">
              <div className="flex items-center gap-8 mb-4">
                <Time size={16} />
                <div className="detail-field-label">Time Spent</div>
              </div>
              <div className="detail-field-value">{workOrder.time_spent_hours.toFixed(1)} hours</div>
            </div>

            {workOrder.started_at && (
              <div className="detail-field">
                <div className="detail-field-label">Started At</div>
                <div className="detail-field-value">{formatDateTime(workOrder.started_at)}</div>
              </div>
            )}

            {workOrder.completed_at && (
              <div className="detail-field">
                <div className="detail-field-label">Completed At</div>
                <div className="detail-field-value">{formatDateTime(workOrder.completed_at)}</div>
              </div>
            )}

            {workOrder.pm_template_id && (
              <div className="detail-field">
                <div className="detail-field-label">PM Template ID</div>
                <div className="detail-field-value">{workOrder.pm_template_id}</div>
              </div>
            )}
          </div>

          {/* Completion Notes */}
          {workOrder.completion_notes && (
            <div className="detail-notes">
              <div className="detail-field-label mb-8">Completion Notes</div>
              <div className="notes-panel">{workOrder.completion_notes}</div>
            </div>
          )}

          {/* Footer */}
          <div className="detail-footer">
            {workOrder.created_at && (
              <div className="footer-timestamp">
                <span className="text-gray">Created:</span>{' '}
                {formatDateTime(workOrder.created_at)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WorkOrderDetailView;
