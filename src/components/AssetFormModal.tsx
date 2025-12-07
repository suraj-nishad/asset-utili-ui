import { useState, useEffect } from 'react';
import { Modal, InlineNotification } from '@carbon/react';
import type { Asset } from '../types';
import { api } from '../utils/api';
import './AssetFormModal.css';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  asset?: Asset | null;
}

const AssetFormModal = ({ isOpen, onClose, onSuccess, asset }: AssetFormModalProps) => {
  const [formData, setFormData] = useState<Partial<Asset>>({
    asset_id: '',
    name: '',
    category: '',
    status: 'Active',
    location_id: undefined,
    owner_cost_center: '',
    vendor: '',
    serial_number: '',
    tag_id: '',
    purchase_date: '',
    warranty_expiry: '',
    purchase_cost: undefined,
    meter_reading: undefined,
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (asset) {
      setFormData({
        asset_id: asset.asset_id,
        name: asset.name,
        category: asset.category,
        status: asset.status,
        location_id: asset.location_id,
        owner_cost_center: asset.owner_cost_center || '',
        vendor: asset.vendor || '',
        serial_number: asset.serial_number || '',
        tag_id: asset.tag_id || '',
        purchase_date: asset.purchase_date || '',
        warranty_expiry: asset.warranty_expiry || '',
        purchase_cost: asset.purchase_cost,
        meter_reading: asset.meter_reading,
        notes: asset.notes || '',
      });
    } else {
      setFormData({
        asset_id: '',
        name: '',
        category: '',
        status: 'Active',
        location_id: undefined,
        owner_cost_center: '',
        vendor: '',
        serial_number: '',
        tag_id: '',
        purchase_date: '',
        warranty_expiry: '',
        purchase_cost: undefined,
        meter_reading: undefined,
        notes: '',
      });
    }
    setError(null);
  }, [asset, isOpen]);

  const handleChange = (field: keyof Asset, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.asset_id || !formData.name || !formData.category || !formData.status) {
      setError('Please fill in all required fields (Asset ID, Name, Category, Status)');
      return;
    }

    setSubmitting(true);

    try {
      const payload: Asset = {
        asset_id: formData.asset_id,
        name: formData.name,
        category: formData.category,
        status: formData.status as Asset['status'],
        location_id: formData.location_id || undefined,
        owner_cost_center: formData.owner_cost_center || undefined,
        vendor: formData.vendor || undefined,
        serial_number: formData.serial_number || undefined,
        tag_id: formData.tag_id || undefined,
        purchase_date: formData.purchase_date || undefined,
        warranty_expiry: formData.warranty_expiry || undefined,
        purchase_cost: formData.purchase_cost || undefined,
        meter_reading: formData.meter_reading || undefined,
        notes: formData.notes || undefined,
      };

      if (asset?.id) {
        await api.assets.update(asset.id, payload);
      } else {
        await api.assets.create(payload);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save asset');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onRequestClose={onClose}
      modalHeading={asset ? 'Edit Asset' : 'Create New Asset'}
      primaryButtonText={asset ? 'Update' : 'Create'}
      secondaryButtonText="Cancel"
      onRequestSubmit={handleSubmit}
      onSecondarySubmit={onClose}
      primaryButtonDisabled={submitting}
      size="lg"
    >
      <div className="form-modal-content">
        {error && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            lowContrast
            className="mb-16"
          />
        )}

        <form onSubmit={handleSubmit} className="asset-form">
          {/* Required Fields */}
          <div className="form-section">
            <h3 className="form-section-title">Required Information</h3>
            
            <div className="input-group">
              <input
                id="asset-id"
                type="text"
                className="input-floating"
                value={formData.asset_id}
                onChange={(e) => handleChange('asset_id', e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="asset-id" className="label-floating">
                Asset ID *
              </label>
            </div>

            <div className="input-group">
              <input
                id="asset-name"
                type="text"
                className="input-floating"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="asset-name" className="label-floating">
                Name *
              </label>
            </div>

            <div className="input-group">
              <input
                id="asset-category"
                type="text"
                className="input-floating"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="asset-category" className="label-floating">
                Category *
              </label>
            </div>

            <div className="input-group">
              <select
                id="asset-status"
                className="select-floating"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="In Maintenance">In Maintenance</option>
                <option value="Retired">Retired</option>
              </select>
              <label htmlFor="asset-status" className="label-floating">
                Status *
              </label>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="form-section">
            <h3 className="form-section-title">Additional Information</h3>

            <div className="form-grid">
              <div className="input-group">
                <input
                  id="location-id"
                  type="number"
                  className="input-floating"
                  value={formData.location_id || ''}
                  onChange={(e) => handleChange('location_id', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder=" "
                />
                <label htmlFor="location-id" className="label-floating">
                  Location ID
                </label>
              </div>

              <div className="input-group">
                <input
                  id="cost-center"
                  type="text"
                  className="input-floating"
                  value={formData.owner_cost_center}
                  onChange={(e) => handleChange('owner_cost_center', e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="cost-center" className="label-floating">
                  Cost Center
                </label>
              </div>

              <div className="input-group">
                <input
                  id="vendor"
                  type="text"
                  className="input-floating"
                  value={formData.vendor}
                  onChange={(e) => handleChange('vendor', e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="vendor" className="label-floating">
                  Vendor
                </label>
              </div>

              <div className="input-group">
                <input
                  id="serial-number"
                  type="text"
                  className="input-floating"
                  value={formData.serial_number}
                  onChange={(e) => handleChange('serial_number', e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="serial-number" className="label-floating">
                  Serial Number
                </label>
              </div>

              <div className="input-group">
                <input
                  id="tag-id"
                  type="text"
                  className="input-floating"
                  value={formData.tag_id}
                  onChange={(e) => handleChange('tag_id', e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="tag-id" className="label-floating">
                  Tag ID
                </label>
              </div>

              <div className="input-group">
                <input
                  id="purchase-date"
                  type="date"
                  className="input-floating"
                  value={formData.purchase_date}
                  onChange={(e) => handleChange('purchase_date', e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="purchase-date" className="label-floating">
                  Purchase Date
                </label>
              </div>

              <div className="input-group">
                <input
                  id="warranty-expiry"
                  type="date"
                  className="input-floating"
                  value={formData.warranty_expiry}
                  onChange={(e) => handleChange('warranty_expiry', e.target.value)}
                  placeholder=" "
                />
                <label htmlFor="warranty-expiry" className="label-floating">
                  Warranty Expiry
                </label>
              </div>

              <div className="input-group">
                <input
                  id="purchase-cost"
                  type="number"
                  step="0.01"
                  className="input-floating"
                  value={formData.purchase_cost || ''}
                  onChange={(e) => handleChange('purchase_cost', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder=" "
                />
                <label htmlFor="purchase-cost" className="label-floating">
                  Purchase Cost ($)
                </label>
              </div>

              <div className="input-group">
                <input
                  id="meter-reading"
                  type="number"
                  className="input-floating"
                  value={formData.meter_reading || ''}
                  onChange={(e) => handleChange('meter_reading', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder=" "
                />
                <label htmlFor="meter-reading" className="label-floating">
                  Meter Reading
                </label>
              </div>
            </div>

            <div className="input-group">
              <textarea
                id="notes"
                className="textarea-floating"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder=" "
                rows={4}
              />
              <label htmlFor="notes" className="label-floating">
                Notes
              </label>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AssetFormModal;
