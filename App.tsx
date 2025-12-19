
import React, { useState } from 'react';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
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
    setCurrentPage('LINES');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('LOGIN');
    setSelectedLineId(null);
    setSelectedDeviceId(null);
  };

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
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
    if (!isAuthenticated) {
      if (currentPage === 'REGISTER') {
        return <RegisterPage onBack={() => setCurrentPage('LOGIN')} />;
      }
      return <LoginPage onLogin={handleLogin} onGoToRegister={() => setCurrentPage('REGISTER')} />;
    }

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

  return (
    <div className="min-h-screen">
      {!isAuthenticated ? (
        renderContent()
      ) : (
        <Layout 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
          userName="張經理"
        >
          {renderContent()}
        </Layout>
      )}
    </div>
  );
};

export default App;
