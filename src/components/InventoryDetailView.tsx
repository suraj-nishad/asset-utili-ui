import { Modal } from '@carbon/react';
import { Information, Close, WarningAlt, Checkmark } from '@carbon/icons-react';
import type { InventoryItem } from '../types';
import './InventoryDetailView.css';

interface InventoryDetailViewProps {
  item: InventoryItem;
  isOpen: boolean;
  onClose: () => void;
}

const InventoryDetailView = ({ item, isOpen, onClose }: InventoryDetailViewProps) => {
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

  const isLowStock = item.stock_on_hand <= item.min_stock;
  const stockDifference = item.stock_on_hand - item.min_stock;
  const totalValue = item.unit_cost ? item.stock_on_hand * item.unit_cost : null;

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
            <h2 className="heading-2">Inventory Item Details</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <Close size={24} />
          </button>
        </div>

        <div className="detail-content">
          {/* Main Info */}
          <div className="detail-main-info">
            <div className="detail-asset-id">{item.part_number}</div>
            <div className="heading-2 mb-12">{item.item_name}</div>
            {isLowStock && (
              <div className="status-badge" style={{ backgroundColor: '#da1e28' }}>
                Low Stock
              </div>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div className="detail-notes mb-24">
              <div className="detail-field-label mb-8">Description</div>
              <div className="notes-panel">{item.description}</div>
            </div>
          )}

          {/* Stock Levels Cards */}
          <div className="stock-cards-grid">
            <div className={`stock-card ${isLowStock ? 'stock-card-warning' : 'stock-card-normal'}`}>
              <div className="stock-card-label">Stock On Hand</div>
              <div className="stock-card-value">{item.stock_on_hand}</div>
            </div>
            
            <div className="stock-card stock-card-gray">
              <div className="stock-card-label">Min Stock</div>
              <div className="stock-card-value">{item.min_stock}</div>
            </div>
            
            {item.max_stock && (
              <div className="stock-card stock-card-gray">
                <div className="stock-card-label">Max Stock</div>
                <div className="stock-card-value">{item.max_stock}</div>
              </div>
            )}
          </div>

          {/* Stock Status Indicator */}
          <div className={`stock-status ${isLowStock ? 'stock-status-warning' : 'stock-status-ok'}`}>
            {isLowStock ? (
              <>
                <WarningAlt size={20} />
                <span>
                  Below minimum level ({Math.abs(stockDifference)} units short)
                </span>
              </>
            ) : (
              <>
                <Checkmark size={20} />
                <span>
                  Adequate stock (+{stockDifference} units above minimum)
                </span>
              </>
            )}
          </div>

          {/* Cost Information */}
          {item.unit_cost && (
            <div className="cost-section">
              <h3 className="cost-section-title">Cost Information</h3>
              <div className="cost-cards-grid">
                <div className="cost-card">
                  <div className="cost-label">Unit Cost</div>
                  <div className="cost-value">{formatCurrency(item.unit_cost)}</div>
                </div>
                
                {totalValue && (
                  <div className="cost-card">
                    <div className="cost-label">Total Value</div>
                    <div className="cost-value">{formatCurrency(totalValue)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="detail-footer">
            {item.created_at && (
              <div className="footer-timestamp">
                <span className="text-gray">Created:</span>{' '}
                {formatDate(item.created_at)}
              </div>
            )}
            {item.updated_at && (
              <div className="footer-timestamp">
                <span className="text-gray">Updated:</span>{' '}
                {formatDate(item.updated_at)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InventoryDetailView;
