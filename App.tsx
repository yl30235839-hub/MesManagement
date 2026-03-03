import React, { useState } from 'react';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import LineManagement from './components/LineManagement';
import EquipmentManagement from './components/EquipmentManagement';
import Line3DView from './components/Line3DView';
import DeviceSettings from './components/DeviceSettings';
import AttendanceMaintenance from './components/AttendanceMaintenance';
import FACAManagement from './components/FACAManagement';
import { PageView, Equipment, ProductionLine } from './types';
import { MOCK_EQUIPMENT, MOCK_LINES } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageView>('LINES');
  const [previousPage, setPreviousPage] = useState<PageView | null>(null);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [selectedLineData, setSelectedLineData] = useState<any>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  
  // Lifted State - Initially from constants
  const [factoryInfo, setFactoryInfo] = useState({ code: 'GL', floor: '3F' });
  const [allLines, setAllLines] = useState<ProductionLine[]>(MOCK_LINES);
  const [allEquipment, setAllEquipment] = useState<Equipment[]>(MOCK_EQUIPMENT);

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
    if (page !== 'EQUIPMENT' && page !== 'DEVICE_SETTINGS' && page !== 'ATTENDANCE_MAINTENANCE' && page !== 'REGISTER' && page !== 'FACA_MANAGEMENT') {
      setSelectedLineId(null);
    }
  };

  const handleViewEquipment = (lineId: string, lineData?: any) => {
    setSelectedLineId(lineId);
    if (lineData) {
      setSelectedLineData(lineData);
    }
    setCurrentPage('EQUIPMENT');
  };

  const handleMaintainDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setCurrentPage('DEVICE_SETTINGS');
  }

  const handleUpdateEquipment = (updatedEquip: Equipment) => {
    setAllEquipment(prev => prev.map(e => e.id === updatedEquip.id ? updatedEquip : e));
  };

  const handleAddEquipment = (newEquip: Equipment) => {
    setAllEquipment(prev => [...prev, newEquip]);
  };

  const handleBackToEquipment = () => {
    setCurrentPage('EQUIPMENT');
    setSelectedDeviceId(null);
  }

  const handleGoToAttendance = (lineId?: string, deviceId?: string) => {
    if (lineId) setSelectedLineId(lineId);
    if (deviceId) setSelectedDeviceId(deviceId);
    setCurrentPage('ATTENDANCE_MAINTENANCE');
  };

  const handleGoToFACA = () => {
    setCurrentPage('FACA_MANAGEMENT');
  };

  const handleGoToRegister = () => {
    setPreviousPage(currentPage);
    setCurrentPage('REGISTER');
  };

  const handleUpdateFactory = (newLines: ProductionLine[], newEquipment: Equipment[], info?: { code: string, floor: string }) => {
    // Merge lines: keep existing lines, update/add new ones
    setAllLines(prev => {
      const otherLines = prev.filter(l => !newLines.some(nl => nl.id === l.id));
      return [...otherLines, ...newLines];
    });
    
    // Merge equipment: keep equipment from other lines, update/add equipment for the lines being updated
    setAllEquipment(prev => {
      const lineIds = newLines.map(l => l.id);
      const otherLinesEquip = prev.filter(e => !lineIds.includes(e.lineId));
      return [...otherLinesEquip, ...newEquipment];
    });
    
    if (info) setFactoryInfo(info);
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      if (currentPage === 'REGISTER') {
        return <RegisterPage onBack={() => setCurrentPage('LOGIN')} />;
      }
      return <LoginPage onLogin={handleLogin} onGoToRegister={() => setCurrentPage('REGISTER')} />;
    }

    switch (currentPage) {
      case 'LINES':
        return (
          <LineManagement 
            onViewEquipment={handleViewEquipment} 
            onUpdateFactory={handleUpdateFactory} 
            lines={allLines}
            equipmentList={allEquipment}
            factoryInfo={factoryInfo}
          />
        );
      case 'EQUIPMENT':
        return (
          <EquipmentManagement 
            lineId={selectedLineId} 
            lineData={selectedLineData}
            equipmentList={allEquipment}
            onAddEquipment={handleAddEquipment}
            onMaintainDevice={handleMaintainDevice} 
          />
        );
      case 'DEVICE_SETTINGS':
        const device = allEquipment.find(e => e.id === selectedDeviceId) || null;
        return (
          <DeviceSettings 
            device={device} 
            onSave={handleUpdateEquipment}
            onBack={handleBackToEquipment} 
          />
        );
      case '3D_VIEW':
        return (
          <Line3DView 
            equipmentList={allEquipment}
            onOpenAttendance={handleGoToAttendance} 
            onOpenFACA={handleGoToFACA} 
          />
        );
      case 'ATTENDANCE_MAINTENANCE':
        return (
          <AttendanceMaintenance 
            lineId={selectedLineId}
            deviceId={selectedDeviceId}
            onBack={() => setCurrentPage('3D_VIEW')} 
            onGoToRegister={handleGoToRegister} 
          />
        );
      case 'FACA_MANAGEMENT':
        return <FACAManagement onBack={() => setCurrentPage('3D_VIEW')} />;
      case 'REGISTER':
        return <RegisterPage onBack={() => setCurrentPage(previousPage || 'ATTENDANCE_MAINTENANCE')} />;
      default:
        return (
          <LineManagement 
            onViewEquipment={handleViewEquipment} 
            onUpdateFactory={handleUpdateFactory} 
            lines={allLines}
            equipmentList={allEquipment}
            factoryInfo={factoryInfo}
          />
        );
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