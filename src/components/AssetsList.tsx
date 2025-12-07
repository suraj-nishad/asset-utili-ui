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
import { Asset as AssetIcon, AddAlt, Information } from '@carbon/icons-react';
import { api } from '../utils/api';
import type { Asset } from '../types';
import AssetDetailView from './AssetDetailView';
import AssetFormModal from './AssetFormModal';
import './AssetsList.css';

const AssetsList = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const fetchAssets = () => {
    setLoading(true);
    api.assets
      .getAll()
      .then((data) => {
        setAssets(data);
        setFilteredAssets(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    let filtered = [...assets];

    if (searchTerm) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.asset_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((asset) => asset.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter((asset) => asset.category === categoryFilter);
    }

    setFilteredAssets(filtered);
  }, [searchTerm, statusFilter, categoryFilter, assets]);

  const categories = Array.from(new Set(assets.map((a) => a.category))).sort();

  const getStatusTagType = (status: string): 'green' | 'gray' | 'red' | 'blue' => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'In Maintenance':
        return 'blue';
      case 'Retired':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleViewDetails = (asset: Asset) => {
    setViewingAsset(asset);
    setIsDetailViewOpen(true);
  };

  const handleCloseDetailView = () => {
    setIsDetailViewOpen(false);
    setViewingAsset(null);
  };

  const handleAddNew = () => {
    setEditingAsset(null);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditingAsset(null);
    fetchAssets();
  };

  const handleFormClose = () => {
    setIsFormModalOpen(false);
    setEditingAsset(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loading description="Loading assets..." withOverlay={false} />
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
    { key: 'asset_id', header: 'Asset ID' },
    { key: 'name', header: 'Name' },
    { key: 'category', header: 'Category' },
    { key: 'status', header: 'Status' },
    { key: 'vendor', header: 'Vendor' },
    { key: 'serial_number', header: 'Serial Number' },
    { key: 'purchase_cost', header: 'Purchase Cost' },
    { key: 'actions', header: 'Actions' },
  ];

  const rows = filteredAssets.map((asset) => ({
    id: asset.id?.toString() || '',
    asset_id: asset.asset_id,
    name: asset.name,
    category: asset.category,
    status: asset.status,
    vendor: asset.vendor || '-',
    serial_number: asset.serial_number || '-',
    purchase_cost: asset.purchase_cost ? `$${asset.purchase_cost.toFixed(2)}` : '-',
    actions: asset,
  }));

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-24">
        <div className="flex items-center gap-12">
          <AssetIcon size={32} />
          <h1 className="heading-1">Assets</h1>
        </div>
        <button
          className="icon-button"
          onClick={handleAddNew}
          aria-label="Add New Asset"
        >
          <AddAlt size={32} />
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section mb-24">
        <div className="input-group">
          <input
            id="search-assets"
            type="text"
            className="input-floating"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder=" "
          />
          <label htmlFor="search-assets" className="label-floating">
            Search assets...
          </label>
        </div>

        <div className="input-group">
          <select
            id="status-filter"
            className="select-floating"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="In Maintenance">In Maintenance</option>
            <option value="Retired">Retired</option>
          </select>
          <label htmlFor="status-filter" className="label-floating">
            Status
          </label>
        </div>

        <div className="input-group">
          <select
            id="category-filter"
            className="select-floating"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <label htmlFor="category-filter" className="label-floating">
            Category
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
                    const asset = filteredAssets.find((a) => a.id?.toString() === row.id);
                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell) => {
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
                                  onClick={() => asset && handleViewDetails(asset)}
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
        {filteredAssets.map((asset) => (
          <Tile key={asset.id} className="asset-card">
            <div className="flex justify-between items-start mb-12">
              <div className="flex-grow">
                <div className="font-medium text-gray">{asset.asset_id}</div>
                <div className="heading-3 mt-4">{asset.name}</div>
              </div>
              <div className="flex items-center gap-12">
                <Tag type={getStatusTagType(asset.status)}>{asset.status}</Tag>
                <button
                  className="icon-button"
                  onClick={() => handleViewDetails(asset)}
                  aria-label="View details"
                >
                  <Information size={24} />
                </button>
              </div>
            </div>
            <div className="asset-details">
              <div className="detail-row">
                <span className="detail-label">Category:</span>
                <span>{asset.category}</span>
              </div>
              {asset.vendor && (
                <div className="detail-row">
                  <span className="detail-label">Vendor:</span>
                  <span>{asset.vendor}</span>
                </div>
              )}
              {asset.serial_number && (
                <div className="detail-row">
                  <span className="detail-label">Serial:</span>
                  <span>{asset.serial_number}</span>
                </div>
              )}
              {asset.purchase_cost && (
                <div className="detail-row">
                  <span className="detail-label">Cost:</span>
                  <span>${asset.purchase_cost.toFixed(2)}</span>
                </div>
              )}
            </div>
          </Tile>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="empty-state">
          <p>No assets found matching your criteria.</p>
        </div>
      )}

      {/* Modals */}
      {viewingAsset && (
        <AssetDetailView
          asset={viewingAsset}
          isOpen={isDetailViewOpen}
          onClose={handleCloseDetailView}
        />
      )}

      <AssetFormModal
        isOpen={isFormModalOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        asset={editingAsset}
      />
    </div>
  );
};

export default AssetsList;
