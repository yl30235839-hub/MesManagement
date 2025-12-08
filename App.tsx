import React, { useState } from 'react';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import LineManagement from './components/LineManagement';
import EquipmentManagement from './components/EquipmentManagement';
import Line3DView from './components/Line3DView';
import DeviceSettings from './components/DeviceSettings';
import { PageView } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageView>('LINES');
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('LINES');
    setSelectedLineId(null);
    setSelectedDeviceId(null);
  };

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    // Clear selection if navigating away from specific views
    if (page !== 'EQUIPMENT' && page !== 'DEVICE_SETTINGS') {
      setSelectedLineId(null);
    }
  };

  const handleViewEquipment = (lineId: string) => {
    setSelectedLineId(lineId);
    setCurrentPage('EQUIPMENT');
  };

  const handleMaintainDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setCurrentPage('DEVICE_SETTINGS');
  }

  const handleBackToEquipment = () => {
    setCurrentPage('EQUIPMENT');
    setSelectedDeviceId(null);
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'LINES':
        return <LineManagement onViewEquipment={handleViewEquipment} />;
      case 'EQUIPMENT':
        return <EquipmentManagement lineId={selectedLineId} onMaintainDevice={handleMaintainDevice} />;
      case 'DEVICE_SETTINGS':
        return <DeviceSettings deviceId={selectedDeviceId} onBack={handleBackToEquipment} />;
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