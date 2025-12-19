
import React, { useState, useEffect } from 'react';
import { MOCK_EQUIPMENT } from '../constants';
import { Equipment, MachineStatus } from '../types';
import { 
  ArrowLeft, Save, Activity, Settings, 
  FileText, Link as LinkIcon,
  Cpu, Zap, Database, Plug, Plus, Trash2, RefreshCw, Server,
  Table as TableIcon, Key, MapPin, X, ChevronRight, Edit3
} from 'lucide-react';

interface DeviceSettingsProps {
  deviceId: string | null;
  onBack: () => void;
}

type TabType = 'BASIC' | 'MAPPING' | 'AUXILIARY';

interface Peripheral {
  id: string;
  name: string;
  type: '指紋儀' | '掃碼槍' | 'RFID' | string;
  status: 'Active' | 'Standby' | 'Offline';
  lastPing?: string;
  config?: Record<string, string>;
}

// PLC/Connection Data Types
const CONNECTION_BRANDS = {
  'Inovance': ['H5U', 'AM600', 'AC800'],
  'Omron': ['CP1H', 'CJ2M', 'NX1P'],
  'Siemens': ['S7-1200', 'S7-1500', 'Smart200'],
  'Mitsubishi': ['FX3U', 'FX5U', 'Q-Series'],
  'Motion Control Card': ['Server', 'Client']
};

interface MappingRow {
  id: string;
  address: string;
  fieldName: string;
  dataType: string;
  description: string;
}

interface MappingTable {
  id: string;
  tableName: string;
  rows: MappingRow[];
}

interface NewTableColumn {
  id: string;
  name: string;
  type: string;
  isPk: boolean;
  notNull: boolean;
}

const DeviceSettings: React.FC<DeviceSettingsProps> = ({ deviceId, onBack }) => {
  const [device, setDevice] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('BASIC');
  
  // Basic Info Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: MachineStatus.Stopped,
    sn: 'SN-2024-001',
    ip: '192.168.1.100',
    stationName: '',
    controlNumber: '',
    controlIp: '',
    plcBrand: 'Inovance',
    plcModel: 'H5U',
    plcIp: '192.168.1.200',
    plcPort: '502',
    plcSlaveId: '1',
    plcDataType: 'Modbus TCP',
    plcStringReverse: false
  });

  // Connection State
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'DISCONNECTED' | 'CONNECTED'>('DISCONNECTED');

  // Mapping Management State
  const [mappingTables, setMappingTables] = useState<MappingTable[]>([
    {
      id: 'mt1',
      tableName: 'realtime_data',
      rows: [
          { id: '1', address: 'D100', fieldName: 'temperature', dataType: 'FLOAT', description: 'Core Temperature' },
          { id: '2', address: 'D102', fieldName: 'vibration', dataType: 'FLOAT', description: 'Vibration Level' }
      ]
    }
  ]);
  const [activeMappingTableId, setActiveMappingTableId] = useState('mt1');

  // Peripherals State
  const [peripherals, setPeripherals] = useState<Peripheral[]>([
    { id: 'p1', name: 'Cooling Unit A1', type: 'Thermal Control', status: 'Active' },
    { id: 'p2', name: 'Hydraulic Pump Main', type: 'Power', status: 'Active' }
  ]);
  const [isAddPeripheralModalOpen, setIsAddPeripheralModalOpen] = useState(false);
  const [newPeripheralType, setNewPeripheralType] = useState('指紋儀');
  const [maintainingPeripheral, setMaintainingPeripheral] = useState<Peripheral | null>(null);

  // New Table Modal State
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [newTableData, setNewTableData] = useState({ name: '' });
  const [newTableColumns, setNewTableColumns] = useState<NewTableColumn[]>([
    { id: 'temp_1', name: 'id', type: 'INT', isPk: true, notNull: true }
  ]);

  useEffect(() => {
    const foundDevice = MOCK_EQUIPMENT.find(e => e.id === deviceId);
    if (foundDevice) {
      setDevice(foundDevice);
      setFormData(prev => ({
        ...prev,
        name: foundDevice.name,
        description: foundDevice.description || '',
        status: foundDevice.status,
        stationName: 'Station-01',
        controlNumber: `CTRL-${foundDevice.id}-001`,
        controlIp: '10.0.0.50'
      }));
    }
    setLoading(false);
  }, [deviceId]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('設備配置已保存！');
    }, 800);
  };

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setConnectionStatus('CONNECTED');
      alert(`已成功連接至 ${formData.plcBrand} ${formData.plcModel}`);
    }, 1500);
  };

  const handleAddPeripheral = () => {
    const newId = `p_${Date.now()}`;
    const newItem: Peripheral = {
      id: newId,
      name: `${newPeripheralType} #${peripherals.length + 1}`,
      type: newPeripheralType,
      status: 'Standby',
      lastPing: new Date().toLocaleTimeString(),
      config: { "Sensitivity": "High", "Buzzer": "On" }
    };
    setPeripherals([...peripherals, newItem]);
    setIsAddPeripheralModalOpen(false);
  };

  const handleUpdatePeripheral = (updated: Peripheral) => {
    setPeripherals(prev => prev.map(p => p.id === updated.id ? updated : p));
    setMaintainingPeripheral(null);
  };

  const handleAddMappingRow = () => {
    setMappingTables(tables => tables.map(table => {
      if (table.id === activeMappingTableId) {
        return {
          ...table,
          rows: [...table.rows, { 
            id: Date.now().toString(), 
            address: '', 
            fieldName: '', 
            dataType: 'INT', 
            description: '' 
          }]
        };
      }
      return table;
    }));
  };

  const handleUpdateMappingRow = (rowId: string, field: keyof MappingRow, value: string) => {
    setMappingTables(tables => tables.map(table => {
      if (table.id === activeMappingTableId) {
        return {
          ...table,
          rows: table.rows.map(row => row.id === rowId ? { ...row, [field]: value } : row)
        };
      }
      return table;
    }));
  };

  const handleDeleteMappingRow = (rowId: string) => {
     setMappingTables(tables => tables.map(table => {
      if (table.id === activeMappingTableId) {
        return {
          ...table,
          rows: table.rows.filter(row => row.id !== rowId)
        };
      }
      return table;
    }));
  };

  const handleSaveMappings = () => {
    alert('映射配置已保存！');
  };

  const handleCreateTable = () => {
    if (!newTableData.name.trim()) return;
    const newMappingTable: MappingTable = {
      id: `mt_${Date.now()}`,
      tableName: newTableData.name,
      rows: newTableColumns.map((col, index) => ({
        id: `row_${Date.now()}_${index}`,
        address: '',
        fieldName: col.name,
        dataType: col.type,
        description: col.isPk ? 'Primary Key' : ''
      }))
    };
    setMappingTables([...mappingTables, newMappingTable]);
    setActiveMappingTableId(newMappingTable.id);
    setIsTableModalOpen(false);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;
  if (!device) return <div className="p-8 text-center text-red-500">Device not found</div>;

  const renderBasicInfo = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center">
           <Server size={20} className="text-blue-600 mr-2" />
           <h3 className="text-lg font-bold text-slate-800">設備基礎信息</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">設備名稱</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">設備編號 (SN)</label>
              <input type="text" value={formData.sn} onChange={(e) => setFormData({...formData, sn: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">IP 地址</label>
              <input type="text" value={formData.ip} onChange={(e) => setFormData({...formData, ip: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">當前狀態</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as MachineStatus})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value={MachineStatus.Running}>RUNNING</option>
                <option value={MachineStatus.Stopped}>STOPPED</option>
                <option value={MachineStatus.Warning}>WARNING</option>
              </select>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center">
           <MapPin size={20} className="text-orange-600 mr-2" />
           <h3 className="text-lg font-bold text-slate-800">工站信息</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">工站名稱</label>
              <input type="text" value={formData.stationName} onChange={(e) => setFormData({...formData, stationName: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">設備管制編號</label>
              <input type="text" value={formData.controlNumber} onChange={(e) => setFormData({...formData, controlNumber: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">設備管制 IP</label>
              <input type="text" value={formData.controlIp} onChange={(e) => setFormData({...formData, controlIp: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
           <div className="flex items-center">
             <Plug size={20} className="text-purple-600 mr-2" />
             <h3 className="text-lg font-bold text-slate-800">連接模組配置</h3>
           </div>
           <div className={`flex items-center text-xs font-bold px-3 py-1 rounded-full ${connectionStatus === 'CONNECTED' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
             {connectionStatus}
           </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">品牌</label>
                <select value={formData.plcBrand} onChange={(e) => setFormData({...formData, plcBrand: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  {Object.keys(CONNECTION_BRANDS).map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">型號</label>
                <select value={formData.plcModel} onChange={(e) => setFormData({...formData, plcModel: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  {CONNECTION_BRANDS[formData.plcBrand as keyof typeof CONNECTION_BRANDS]?.map(model => <option key={model} value={model}>{model}</option>)}
                </select>
             </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleConnect} disabled={isConnecting} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md">
              {isConnecting ? '連接中...' : '連接'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMapping = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px] animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
           <div className="flex items-center">
             <Database size={20} className="text-green-600 mr-2" />
             <h3 className="text-lg font-bold text-slate-800">映射管理模塊</h3>
           </div>
           <button onClick={handleSaveMappings} className="flex items-center px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg shadow-sm">
             <Save size={16} className="mr-1.5" /> 保存映射
           </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
           <div className="w-48 bg-slate-50 border-r border-slate-200 overflow-y-auto flex flex-col">
             <div className="flex-1">
                {mappingTables.map(table => (
                  <button key={table.id} onClick={() => setActiveMappingTableId(table.id)} className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 ${activeMappingTableId === table.id ? 'bg-white border-green-600 text-green-700 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}>
                    {table.tableName}
                  </button>
                ))}
             </div>
             <div className="p-3 border-t border-slate-200 bg-slate-100">
               <button onClick={() => setIsTableModalOpen(true)} className="w-full flex items-center justify-center py-2 bg-white border border-slate-300 text-slate-600 text-xs font-bold rounded hover:bg-blue-50 shadow-sm">
                 <Plus size={14} className="mr-1" /> 新建數據表
               </button>
             </div>
           </div>
           <div className="flex-1 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white font-bold text-slate-700">
                 Table: {mappingTables.find(t => t.id === activeMappingTableId)?.tableName}
                 <button onClick={handleAddMappingRow} className="text-xs flex items-center text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-50 rounded">
                   <Plus size={14} className="mr-1" /> 添加點位
                 </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                 <table className="w-full text-left border-collapse">
                    <thead className="text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
                       <tr>
                          <th className="px-3 py-2">PLC Address</th>
                          <th className="px-3 py-2">Field</th>
                          <th className="px-3 py-2">Type</th>
                          <th className="px-3 py-2 w-16"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {mappingTables.find(t => t.id === activeMappingTableId)?.rows.map(row => (
                          <tr key={row.id} className="group hover:bg-slate-50">
                             <td className="px-3 py-2"><input type="text" value={row.address} onChange={(e) => handleUpdateMappingRow(row.id, 'address', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" /></td>
                             <td className="px-3 py-2"><input type="text" value={row.fieldName} onChange={(e) => handleUpdateMappingRow(row.id, 'fieldName', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" /></td>
                             <td className="px-3 py-2">
                                <select value={row.dataType} onChange={(e) => handleUpdateMappingRow(row.id, 'dataType', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded text-sm bg-white outline-none">
                                   <option value="INT">INT</option><option value="FLOAT">FLOAT</option><option value="BOOL">BOOL</option>
                                </select>
                             </td>
                             <td className="px-3 py-2 text-center"><button onClick={() => handleDeleteMappingRow(row.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button></td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
    </div>
  );

  const renderPeripheralMaintenance = (peripheral: Peripheral) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button onClick={() => setMaintainingPeripheral(null)} className="p-2 mr-4 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h3 className="text-xl font-bold text-slate-800">維護設備: {peripheral.name}</h3>
            <p className="text-sm text-slate-500">類型: {peripheral.type} | 當前狀態: <span className="text-green-600 font-bold">{peripheral.status}</span></p>
          </div>
        </div>
        <button onClick={() => handleUpdatePeripheral(peripheral)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors">
          保存修改
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-4 flex items-center"><Edit3 size={18} className="mr-2" /> 基本維護項</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">顯示名稱</label>
                <input 
                  type="text" 
                  defaultValue={peripheral.name} 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">運行模式</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option>標準模式</option>
                  <option>調試模式</option>
                  <option>節能模式</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-4 flex items-center"><Settings size={18} className="mr-2" /> 參數配置</h4>
            <div className="space-y-4">
               {peripheral.config ? Object.entries(peripheral.config).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-white rounded border border-slate-100 shadow-sm">
                    <span className="text-sm font-medium text-slate-600">{key}</span>
                    <input type="text" defaultValue={val} className="w-24 text-right border-none font-bold text-blue-600 focus:ring-0" />
                  </div>
               )) : <p className="text-sm text-slate-400 italic">暫無特定參數</p>}
            </div>
          </div>
          
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
            <p className="text-xs text-orange-700 flex items-center font-bold uppercase tracking-wider mb-1">
              <Zap size={14} className="mr-1.5" /> Maintenance Tip
            </p>
            <p className="text-xs text-orange-600">
              建議每 30 天清理一次感應器表面，並在維護結束後執行自我診斷測試。
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuxiliary = () => {
    if (maintainingPeripheral) {
      return renderPeripheralMaintenance(maintainingPeripheral);
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <LinkIcon size={20} className="mr-2 text-blue-600" />
            Connected Peripherals
          </h3>
          <button 
            onClick={() => setIsAddPeripheralModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-95"
          >
            <Plus size={18} className="mr-1.5" /> 添加設備
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {peripherals.map((item) => (
             <div key={item.id} className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                   <div className="flex items-center">
                      <div className="p-3 bg-slate-100 rounded-lg mr-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Zap size={22} className="text-slate-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">{item.type}</div>
                      </div>
                   </div>
                   <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${item.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                     {item.status}
                   </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                   <button 
                    onClick={() => setMaintainingPeripheral(item)}
                    className="flex items-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors py-1.5 px-3 rounded-lg hover:bg-blue-50"
                   >
                     維護設備 <ChevronRight size={14} className="ml-1" />
                   </button>
                </div>
             </div>
           ))}

           {peripherals.length === 0 && (
             <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-xl">
               <Zap size={40} className="mx-auto text-slate-200 mb-3" />
               <p className="text-slate-400">目前未連接任何輔助設備</p>
             </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"><ArrowLeft size={24} /></button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">設備管理配置</h2>
            <div className="flex items-center text-sm text-slate-500 mt-1">
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 mr-2">ID: {device.id}</span>
              <span className="flex items-center"><Cpu size={14} className="mr-1" /> {device.type}</span>
            </div>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-all active:scale-95">
          {saving ? <span className="flex items-center"><Activity className="animate-spin mr-2" size={18} /> 保存中...</span> : <span className="flex items-center"><Save className="mr-2" size={18} /> 保存配置</span>}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-2">
         <div className="flex overflow-x-auto no-scrollbar">
            {(['BASIC', 'MAPPING', 'AUXILIARY'] as TabType[]).map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setMaintainingPeripheral(null); }} className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                {tab === 'BASIC' ? '基礎信息' : tab === 'MAPPING' ? '映射管理' : '輔助設備'}
              </button>
            ))}
         </div>
      </div>

      <div>
        {activeTab === 'BASIC' && renderBasicInfo()}
        {activeTab === 'MAPPING' && renderMapping()}
        {activeTab === 'AUXILIARY' && renderAuxiliary()}
      </div>

      {/* Add Peripheral Modal */}
      {isAddPeripheralModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h4 className="font-bold text-slate-800">添加輔助設備</h4>
                <button onClick={() => setIsAddPeripheralModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="p-6">
                 <label className="block text-sm font-medium text-slate-700 mb-3">請選擇設備類型:</label>
                 <div className="space-y-3">
                    {['指紋儀', '掃碼槍', 'RFID'].map(type => (
                      <button 
                        key={type} 
                        onClick={() => setNewPeripheralType(type)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${newPeripheralType === type ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-100 bg-slate-50 hover:border-slate-300'}`}
                      >
                         <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${newPeripheralType === type ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                               {newPeripheralType === type && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                            </div>
                            <span className={`font-bold ${newPeripheralType === type ? 'text-blue-700' : 'text-slate-600'}`}>{type}</span>
                         </div>
                      </button>
                    ))}
                 </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                 <button onClick={() => setIsAddPeripheralModalOpen(false)} className="flex-1 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-lg">取消</button>
                 <button onClick={handleAddPeripheral} className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md">確定添加</button>
              </div>
           </div>
        </div>
      )}

      {/* New Table Modal (from Mapping tab) */}
      {isTableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">新建數據庫表</h3>
              <button onClick={() => setIsTableModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">表名稱 *</label>
                <input type="text" value={newTableData.name} onChange={(e) => setNewTableData({...newTableData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none" placeholder="e.g. motor_logs" />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button onClick={() => setIsTableModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg">取消</button>
              <button onClick={handleCreateTable} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">確定創建</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceSettings;
