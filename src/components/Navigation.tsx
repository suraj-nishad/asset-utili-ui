import { Dashboard, Asset, TaskComplete, Package } from '@carbon/icons-react';
import './Navigation.css';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  mobileMenuOpen?: boolean;
}

const Navigation = ({ currentView, onNavigate, mobileMenuOpen = false }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Dashboard },
    { id: 'assets', label: 'Assets', icon: Asset },
    { id: 'work-orders', label: 'Work Orders', icon: TaskComplete },
    { id: 'inventory', label: 'Inventory', icon: Package },
  ];

  return (
    <nav className={`sidebar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Asset Manager</h2>
      </div>
      
      <div className="nav-buttons">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-button ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-label={item.label}
            >
              <Icon size={24} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="sidebar-footer">
        <p className="copyright">© 2025 Asset Manager</p>
      </div>
    </nav>
  );
};

export default Navigation;
