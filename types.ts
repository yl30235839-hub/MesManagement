
export enum MachineStatus {
  Running = 'RUNNING',
  Stopped = 'STOPPED',
  Warning = 'WARNING',
  Maintenance = 'MAINTENANCE'
}

export interface Factory {
  id: string;
  name: string;
  location: string;
  manager: string;
  totalLines: number;
  efficiency: number;
}

export interface ProductionLine {
  id: string;
  factoryId: string;
  name: string;
  description?: string;
  category?: string;
  status: MachineStatus;
  outputPerHour: number;
  targetOutput: number;
}

export interface Equipment {
  id: string;
  lineId: string;
  name: string;
  type: string;
  description?: string;
  status: MachineStatus;
  temperature: number;
  vibration: number;
  lastMaintenance: string;
}

export type PageView = 'LOGIN' | 'LINES' | 'EQUIPMENT' | '3D_VIEW' | 'DEVICE_SETTINGS';
