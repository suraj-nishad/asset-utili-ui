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
import { Package, AddAlt, Information } from '@carbon/icons-react';
import { api } from '../utils/api';
import type { InventoryItem } from '../types';
import InventoryDetailView from './InventoryDetailView';
import './InventoryList.css';

const InventoryList = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);

  const fetchInventory = () => {
    setLoading(true);
    api.inventory
      .getAll()
      .then((data) => {
        setInventory(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const isLowStock = (item: InventoryItem): boolean => {
    return item.stock_on_hand <= item.min_stock;
  };

  const handleViewDetails = (item: InventoryItem) => {
    setViewingItem(item);
    setIsDetailViewOpen(true);
  };

  const handleCloseDetailView = () => {
    setIsDetailViewOpen(false);
    setViewingItem(null);
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '-';
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loading description="Loading inventory..." withOverlay={false} />
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
    { key: 'part_number', header: 'Part Number' },
    { key: 'item_name', header: 'Item Name' },
    { key: 'description', header: 'Description' },
    { key: 'stock_on_hand', header: 'Stock On Hand' },
    { key: 'min_stock', header: 'Min Stock' },
    { key: 'max_stock', header: 'Max Stock' },
    { key: 'unit_cost', header: 'Unit Cost' },
    { key: 'actions', header: 'Actions' },
  ];

  const rows = inventory.map((item) => ({
    id: item.id?.toString() || '',
    part_number: item.part_number,
    item_name: item.item_name,
    description: item.description || '-',
    stock_on_hand: item.stock_on_hand,
    min_stock: item.min_stock,
    max_stock: item.max_stock || '-',
    unit_cost: formatCurrency(item.unit_cost),
    actions: item,
  }));

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-24">
        <div className="flex items-center gap-12">
          <Package size={32} />
          <h1 className="heading-1">Inventory</h1>
        </div>
        <button
          className="icon-button"
          onClick={() => alert('Add Inventory Item - Coming Soon')}
          aria-label="Add New Inventory Item"
        >
          <AddAlt size={32} />
        </button>
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
                    const item = inventory.find((i) => i.id?.toString() === row.id);
                    const lowStock = item ? isLowStock(item) : false;
                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell) => {
                          if (cell.info.header === 'stock_on_hand') {
                            return (
                              <TableCell key={cell.id}>
                                <span className={lowStock ? 'low-stock-value' : ''}>
                                  {cell.value}
                                </span>
                                {lowStock && (
                                  <Tag type="red" size="sm" className="ml-8">
                                    Low Stock
                                  </Tag>
                                )}
                              </TableCell>
                            );
                          }
                          if (cell.info.header === 'actions') {
                            return (
                              <TableCell key={cell.id}>
                                <button
                                  className="icon-button"
                                  onClick={() => item && handleViewDetails(item)}
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
        {inventory.map((item) => {
          const lowStock = isLowStock(item);
          return (
            <Tile key={item.id} className="inventory-card">
              <div className="flex justify-between items-start mb-12">
                <div className="flex-grow">
                  <div className="font-medium text-gray">{item.part_number}</div>
                  <div className="heading-3 mt-4">{item.item_name}</div>
                </div>
                <button
                  className="icon-button"
                  onClick={() => handleViewDetails(item)}
                  aria-label="View details"
                >
                  <Information size={24} />
                </button>
              </div>
              {item.description && (
                <div className="mb-12 text-gray">{item.description}</div>
              )}
              <div className="inventory-details">
                <div className="stock-row">
                  <span className="detail-label">Stock On Hand:</span>
                  <span className={lowStock ? 'low-stock-value' : ''}>
                    {item.stock_on_hand}
                  </span>
                  {lowStock && (
                    <Tag type="red" size="sm">
                      Low Stock
                    </Tag>
                  )}
                </div>
                <div className="detail-row">
                  <span className="detail-label">Min Stock:</span>
                  <span>{item.min_stock}</span>
                </div>
                {item.max_stock && (
                  <div className="detail-row">
                    <span className="detail-label">Max Stock:</span>
                    <span>{item.max_stock}</span>
                  </div>
                )}
                {item.unit_cost && (
                  <div className="detail-row">
                    <span className="detail-label">Unit Cost:</span>
                    <span>{formatCurrency(item.unit_cost)}</span>
                  </div>
                )}
              </div>
            </Tile>
          );
        })}
      </div>

      {inventory.length === 0 && (
        <div className="empty-state">
          <p>No inventory items found.</p>
        </div>
      )}

      {/* Detail Modal */}
      {viewingItem && (
        <InventoryDetailView
          item={viewingItem}
          isOpen={isDetailViewOpen}
          onClose={handleCloseDetailView}
        />
      )}
    </div>
  );
};

export default InventoryList;
