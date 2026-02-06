
export enum MachineStatus {
  Running = 'RUNNING',
  Stopped = 'STOPPED',
  Warning = 'WARNING',
  Maintenance = 'MAINTENANCE'
}

export enum LineType {
  NVIDIA = 'VKLine_NVIDIA',
  APPLE = 'VKLine_APPLE'
}

export enum EquipmentType {
  AssemblyEquipment = '組裝設備',
  AGVCarEquipment = 'AGV小車',
  CheckinEquipment = '打卡設備',
  TestingEquipment = '檢測設備'
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
  lineType?: LineType;
  status: MachineStatus;
  outputPerHour: number;
  targetOutput: number;
}

export interface Equipment {
  id: string;
  lineId: string;
  name: string;
  type: EquipmentType;
  description?: string;
  status: MachineStatus;
  temperature: number;
  vibration: number;
  lastMaintenance: string;
  // Specialized fields for Clock-in Device
  factoryArea?: string;
  floor?: string;
  sn?: string;
  fingerprintId?: string;
}

export type PageView = 'LOGIN' | 'REGISTER' | 'LINES' | 'EQUIPMENT' | '3D_VIEW' | 'DEVICE_SETTINGS' | 'ATTENDANCE_MAINTENANCE' | 'FACA_MANAGEMENT';