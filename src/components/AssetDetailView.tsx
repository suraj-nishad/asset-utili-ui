import { Modal } from '@carbon/react';
import { Information, Close } from '@carbon/icons-react';
import type { Asset } from '../types';
import './AssetDetailView.css';

interface AssetDetailViewProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
}

const AssetDetailView = ({ asset, isOpen, onClose }: AssetDetailViewProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#24a148';
      case 'In Maintenance':
        return '#1C6BBA';
      case 'Retired':
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
            <h2 className="heading-2">Asset Details</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <Close size={24} />
          </button>
        </div>

        <div className="detail-content">
          {/* Main Info */}
          <div className="detail-main-info">
            <div className="detail-asset-id">{asset.asset_id}</div>
            <div className="heading-2 mb-8">{asset.name}</div>
            <div
              className="status-badge"
              style={{ backgroundColor: getStatusColor(asset.status) }}
            >
              {asset.status}
            </div>
          </div>

          {/* Details Grid */}
          <div className="detail-grid">
            <div className="detail-field">
              <div className="detail-field-label">Category</div>
              <div className="detail-field-value">{asset.category}</div>
            </div>

            {asset.serial_number && (
              <div className="detail-field">
                <div className="detail-field-label">Serial Number</div>
                <div className="detail-field-value">{asset.serial_number}</div>
              </div>
            )}

            {asset.tag_id && (
              <div className="detail-field">
                <div className="detail-field-label">Tag ID</div>
                <div className="detail-field-value">{asset.tag_id}</div>
              </div>
            )}

            {asset.vendor && (
              <div className="detail-field">
                <div className="detail-field-label">Vendor</div>
                <div className="detail-field-value">{asset.vendor}</div>
              </div>
            )}

            <div className="detail-field">
              <div className="detail-field-label">Purchase Date</div>
              <div className="detail-field-value">{formatDate(asset.purchase_date)}</div>
            </div>

            <div className="detail-field">
              <div className="detail-field-label">Purchase Cost</div>
              <div className="detail-field-value">{formatCurrency(asset.purchase_cost)}</div>
            </div>

            <div className="detail-field">
              <div className="detail-field-label">Warranty Expiry</div>
              <div className="detail-field-value">{formatDate(asset.warranty_expiry)}</div>
            </div>

            {asset.location_id && (
              <div className="detail-field">
                <div className="detail-field-label">Location ID</div>
                <div className="detail-field-value">{asset.location_id}</div>
              </div>
            )}

            {asset.owner_cost_center && (
              <div className="detail-field">
                <div className="detail-field-label">Cost Center</div>
                <div className="detail-field-value">{asset.owner_cost_center}</div>
              </div>
            )}

            {asset.meter_reading !== undefined && asset.meter_reading !== null && (
              <div className="detail-field">
                <div className="detail-field-label">Meter Reading</div>
                <div className="detail-field-value">{asset.meter_reading}</div>
              </div>
            )}
          </div>

          {/* Notes */}
          {asset.notes && (
            <div className="detail-notes">
              <div className="detail-field-label mb-8">Notes</div>
              <div className="notes-panel">{asset.notes}</div>
            </div>
          )}

          {/* Footer */}
          <div className="detail-footer">
            {asset.created_at && (
              <div className="footer-timestamp">
                <span className="text-gray">Created:</span>{' '}
                {formatDate(asset.created_at)}
              </div>
            )}
            {asset.updated_at && (
              <div className="footer-timestamp">
                <span className="text-gray">Updated:</span>{' '}
                {formatDate(asset.updated_at)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AssetDetailView;
