import { Factory, ProductionLine, Equipment, MachineStatus, EquipmentType } from './types';

export const MOCK_FACTORIES: Factory[] = [
  { id: 'F1', name: '台北總廠', location: '台北市', manager: '張經理', totalLines: 1, efficiency: 95 },
];

export const MOCK_LINES: ProductionLine[] = [
  { id: 'L1', factoryId: 'F1', name: 'Assembly Line A', status: MachineStatus.Running, outputPerHour: 480, targetOutput: 500 },
];

export const MOCK_EQUIPMENT: Equipment[] = [
  { 
    id: 'E1', 
    lineId: 'L1', 
    name: 'Cap流量檢測設備', 
    type: EquipmentType.AssemblyEquipment, 
    status: MachineStatus.Running, 
    temperature: 65, 
    vibration: 2.1, 
    lastMaintenance: '2024-03-01' 
  },
  { 
    id: 'E3', 
    lineId: 'L1', 
    name: '車間指紋打卡機', 
    type: EquipmentType.CheckinEquipment, 
    status: MachineStatus.Running, 
    temperature: 28, 
    vibration: 0, 
    lastMaintenance: '2024-03-20', 
    factoryArea: '台北總廠', 
    floor: '1F', 
    sn: 'SN-CLK-2024', 
    fingerprintId: '1' 
  },
];