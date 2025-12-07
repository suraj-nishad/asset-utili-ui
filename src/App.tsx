import { useState } from 'react';
import { Menu, Close } from '@carbon/icons-react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import AssetsList from './components/AssetsList';
import WorkOrdersList from './components/WorkOrdersList';
import InventoryList from './components/InventoryList';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'assets':
        return <AssetsList />;
      case 'work-orders':
        return <WorkOrdersList />;
      case 'inventory':
        return <InventoryList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Hamburger Button */}
      <button
        className="hamburger-button"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <Close size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Navigation */}
      <Navigation
        currentView={currentView}
        onNavigate={handleNavigate}
        mobileMenuOpen={mobileMenuOpen}
      />

      {/* Main Content */}
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
