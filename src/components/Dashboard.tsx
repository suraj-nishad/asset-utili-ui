import { useEffect, useState } from 'react';
import { Loading, InlineNotification } from '@carbon/react';
import {
  Dashboard as DashboardIcon,
  Asset,
  CheckmarkFilled,
  TaskComplete,
  DocumentBlank,
  InProgress,
  WarningAlt,
  Calendar,
} from '@carbon/icons-react';
import { api } from '../utils/api';
import type { DashboardStats } from '../types';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    api.dashboard
      .getStats()
      .then((data) => {
        setStats(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Loading description="Loading dashboard..." withOverlay={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          lowContrast
        />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      label: 'Total Assets',
      value: stats.total_assets,
      icon: Asset,
      color: 'blue',
    },
    {
      label: 'Active Assets',
      value: stats.active_assets,
      icon: CheckmarkFilled,
      color: 'green',
    },
    {
      label: 'Total Work Orders',
      value: stats.total_work_orders,
      icon: TaskComplete,
      color: 'blue',
    },
    {
      label: 'Open Work Orders',
      value: stats.open_work_orders,
      icon: DocumentBlank,
      color: 'gray',
    },
    {
      label: 'In Progress',
      value: stats.in_progress_work_orders,
      icon: InProgress,
      color: 'orange',
    },
    {
      label: 'Low Stock Items',
      value: stats.low_stock_items,
      icon: WarningAlt,
      color: stats.low_stock_items > 0 ? 'orange' : 'gray',
    },
    {
      label: 'PM Due (7 days)',
      value: stats.due_pms_next_7_days,
      icon: Calendar,
      color: 'blue',
    },
  ];

  return (
    <div className="container">
      <div className="flex items-center gap-12 mb-24">
        <DashboardIcon size={32} />
        <h1 className="heading-1">Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="stat-card">
              <div className="stat-icon-label">
                <Icon size={24} className={`stat-icon stat-icon-${card.color}`} />
                <span className="stat-label">{card.label}</span>
              </div>
              <div className={`stat-value stat-value-${card.color}`}>
                {card.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
