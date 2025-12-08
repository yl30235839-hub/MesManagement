import React, { useState } from 'react';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import LineManagement from './components/LineManagement';
import EquipmentManagement from './components/EquipmentManagement';
import Line3DView from './components/Line3DView';
import { PageView } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageView>('LINES');
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('LINES');
    setSelectedLineId(null);
  };

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    // Clear selection if navigating away from equipment view via sidebar (if added back later)
    if (page !== 'EQUIPMENT') {
      setSelectedLineId(null);
    }
  };

  const handleViewEquipment = (lineId: string) => {
    setSelectedLineId(lineId);
    setCurrentPage('EQUIPMENT');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'LINES':
        return <LineManagement onViewEquipment={handleViewEquipment} />;
      case 'EQUIPMENT':
        return <EquipmentManagement lineId={selectedLineId} />;
      case '3D_VIEW':
        return <Line3DView />;
      default:
        return <LineManagement onViewEquipment={handleViewEquipment} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentPage={currentPage} 
      onNavigate={handleNavigate} 
      onLogout={handleLogout}
      userName="張經理"
    >
      {renderContent()}
    </Layout>
  );
};

export default App;