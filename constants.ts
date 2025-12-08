import { Factory, ProductionLine, Equipment, MachineStatus } from './types';

export const MOCK_FACTORIES: Factory[] = [
  { id: 'F1', name: 'Taipei Main Plant', location: 'Taipei, Taiwan', manager: 'Alice Chen', totalLines: 8, efficiency: 92 },
  { id: 'F2', name: 'Kaohsiung Electronics', location: 'Kaohsiung, Taiwan', manager: 'Bob Lin', totalLines: 12, efficiency: 88 },
  { id: 'F3', name: 'Taichung Precision', location: 'Taichung, Taiwan', manager: 'Charlie Wu', totalLines: 5, efficiency: 95 },
];

export const MOCK_LINES: ProductionLine[] = [
  { id: 'L1', factoryId: 'F1', name: 'Assembly Line A', status: MachineStatus.Running, outputPerHour: 450, targetOutput: 500 },
  { id: 'L2', factoryId: 'F1', name: 'Assembly Line B', status: MachineStatus.Warning, outputPerHour: 320, targetOutput: 500 },
  { id: 'L3', factoryId: 'F2', name: 'SMT Line 1', status: MachineStatus.Running, outputPerHour: 1200, targetOutput: 1200 },
  { id: 'L4', factoryId: 'F2', name: 'SMT Line 2', status: MachineStatus.Stopped, outputPerHour: 0, targetOutput: 1200 },
];

export const MOCK_EQUIPMENT: Equipment[] = [
  { id: 'E1', lineId: 'L1', name: 'Robotic Arm Alpha', type: 'Robot', status: MachineStatus.Running, temperature: 65, vibration: 2.1, lastMaintenance: '2023-10-15' },
  { id: 'E2', lineId: 'L1', name: 'Conveyor Belt Controller', type: 'PLC', status: MachineStatus.Running, temperature: 45, vibration: 0.5, lastMaintenance: '2023-11-01' },
  { id: 'E3', lineId: 'L1', name: 'Quality Scanner', type: 'Sensor', status: MachineStatus.Warning, temperature: 55, vibration: 1.2, lastMaintenance: '2023-09-20' },
  { id: 'E4', lineId: 'L2', name: 'Hydraulic Press', type: 'Press', status: MachineStatus.Stopped, temperature: 22, vibration: 0, lastMaintenance: '2023-10-30' },
];
