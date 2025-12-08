
import React, { useState } from 'react';
import { MOCK_EQUIPMENT } from '../constants';
import { MachineStatus, Equipment } from '../types';
import { 
  Thermometer, Activity, Wrench, Clock, Settings, Filter, 
  Database, Table as TableIcon, Plus, Trash2, Cpu, 
  Search, Key, List, X, GripVertical
} from 'lucide-react';

interface EquipmentManagementProps {
  lineId?: string | null;
  onMaintainDevice?: (deviceId: string) => void;
}

// --- Types for Database View ---
interface DBColumn {
  id: string; // Internal ID for UI rendering
  name: string;
  type: string;
  length?: number;
  isPk: boolean;
  notNull: boolean;
  defaultValue?: string;
}

interface DBTable {
  id: string;
  name: string;
  rowCount: number;
  engine: string;
  columns: DBColumn[];
}

// --- Mock Data for Tables ---
const MOCK_TABLES: DBTable[] = [
  {
    id: 't1',
    name: 'equipment_logs',
    rowCount: 15420,
    engine: 'InnoDB',
    columns: [
      { id: 'c1', name: 'log_id', type: 'BIGINT', isPk: true, notNull: true },
      { id: 'c2', name: 'equipment_id', type: 'VARCHAR', length: 50, isPk: false, notNull: true },
      { id: 'c3', name: 'log_level', type: 'ENUM', isPk: false, notNull: true, defaultValue: "'INFO'" },
      { id: 'c4', name: 'message', type: 'TEXT', isPk: false, notNull: false },
      { id: 'c5', name: 'created_at', type: 'TIMESTAMP', isPk: false, notNull: true, defaultValue: 'CURRENT_TIMESTAMP' }
    ]
  },
  {
    id: 't2',
    name: 'production_metrics',
    rowCount: 850,
    engine: 'InnoDB',
    columns: [
      { id: 'c1', name: 'id', type: 'INT', isPk: true, notNull: true },
      { id: 'c2', name: 'line_id', type: 'VARCHAR', length: 20, isPk: false, notNull: true },
      { id: 'c3', name: 'output_count', type: 'INT', isPk: false, notNull: true, defaultValue: '0' },
      { id: 'c4', name: 'defect_count', type: 'INT', isPk: false, notNull: true, defaultValue: '0' },
      { id: 'c5', name: 'efficiency_score', type: 'DECIMAL', length: 5, isPk: false, notNull: false },
      { id: 'c6', name: 'shift_date', type: 'DATE', isPk: false, notNull: true }
    ]
  },
  {
    id: 't3',
    name: 'system_users',
    rowCount: 12,
    engine: 'InnoDB',
    columns: [
      { id: 'c1', name: 'user_id', type: 'INT', isPk: true, notNull: true },
      { id: 'c2', name: 'username', type: 'VARCHAR', length: 100, isPk: false, notNull: true },
      { id: 'c3', name: 'password_hash', type: 'VARCHAR', length: 255, isPk: false, notNull: true },
      { id: 'c4', name: 'role', type: 'VARCHAR', length: 50, isPk: false, notNull: true, defaultValue: "'operator'" },
      { id: 'c5', name: 'last_login', type: 'DATETIME', isPk: false, notNull: false }
    ]
  }
];

const EquipmentManagement: React.FC<EquipmentManagementProps> = ({ lineId, onMaintainDevice }) => {
  const [activeTab, setActiveTab] = useState<'STATUS' | 'DATABASE'>('STATUS');
  
  // Equipment State
  const [allEquipment, setAllEquipment] = useState<Equipment[]>(MOCK_EQUIPMENT);
  
  // Modal State for Adding Equipment
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEquipData, setNewEquipData] = useState({
    type: '組裝設備',
    name: '',
    description: ''
  });

  // Database State
  const [tables, setTables] = useState<DBTable[]>(MOCK_TABLES);
  const [selectedTableId, setSelectedTableId] = useState<string>(MOCK_TABLES[0].id);

  // Modal State for Adding Table
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [newTableData, setNewTableData] = useState({
    name: '',
    engine: 'InnoDB'
  });
  const [newTableColumns, setNewTableColumns] = useState<DBColumn[]>([
    { id: 'temp_1', name: 'id', type: 'INT', isPk: true, notNull: true }
  ]);

  const activeEquipmentList = lineId 
    ? allEquipment.filter(e => e.lineId === lineId) 
    : allEquipment;

  const selectedTable = tables.find(t => t.id === selectedTableId);

  // --- Handlers for Equipment ---
  const handleAddEquipment = () => {
    if (!newEquipData.name.trim()) return;

    const newId = `E${Math.floor(Math.random() * 10000)}`;
    const newEquip: Equipment = {
      id: newId,
      lineId: lineId || 'L1', // Default to L1 if no line selected
      name: newEquipData.name,
      type: newEquipData.type,
      description: newEquipData.description,
      status: MachineStatus.Stopped, // Default to stopped
      temperature: 20,
      vibration: 0,
      lastMaintenance: new Date().toISOString().split('T')[0]
    };
    
    setAllEquipment([...allEquipment, newEquip]);
    setIsAddModalOpen(false);
    setNewEquipData({ type: '組裝設備', name: '', description: '' });
  };

  // --- Handlers for Database ---
  const handleAddColumnRow = () => {
    const newColId = `temp_${Date.now()}`;
    setNewTableColumns([...newTableColumns, { 
      id: newColId, 
      name: '', 
      type: 'VARCHAR', 
      isPk: false, 
      notNull: false 
    }]);
  };

  const handleRemoveColumnRow = (colId: string) => {
    if (newTableColumns.length <= 1) return; // Prevent removing last column
    setNewTableColumns(newTableColumns.filter(c => c.id !== colId));
  };

  const updateColumnRow = (id: string, field: keyof DBColumn, value: any) => {
    setNewTableColumns(newTableColumns.map(col => 
      col.id === id ? { ...col, [field]: value } : col
    ));
  };

  const handleCreateTable = () => {
    if (!newTableData.name.trim()) {
      alert("請輸入表名");
      return;
    }
    const invalidCols = newTableColumns.filter(c => !c.name.trim());
    if (invalidCols.length > 0) {
      alert("請完善所有列的名稱");
      return;
    }

    const newTable: DBTable = {
      id: `t_${Date.now()}`,
      name: newTableData.name,
      engine: newTableData.engine,
      rowCount: 0,
      columns: newTableColumns
    };

    setTables([...tables, newTable]);
    setSelectedTableId(newTable.id);
    setIsTableModalOpen(false);
    
    // Reset form
    setNewTableData({ name: '', engine: 'InnoDB' });
    setNewTableColumns([{ id: `temp_${Date.now()}`, name: 'id', type: 'INT', isPk: true, notNull: true }]);
  };

  return (
    <div className="relative">
      {/* Module Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('STATUS')}
          className={`flex items-center px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'STATUS' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Cpu size={18} className="mr-2" />
          產綫設備概覽
        </button>
        <button
          onClick={() => setActiveTab('DATABASE')}
          className={`flex items-center px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'DATABASE' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Database size={18} className="mr-2" />
          數據庫結構管理
        </button>
      </div>

      {activeTab === 'STATUS' ? (
        // --- Equipment Monitoring View ---
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">產綫設備詳情</h2>
              {lineId && <p className="text-sm text-slate-500 mt-1">當前產綫: <span className="font-mono font-bold text-blue-600">{lineId}</span></p>}
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center shadow-sm transition-colors"
              >
                <Plus size={16} className="mr-2" /> 新增設備實例
              </button>
              {!lineId && (
                <div className="relative">
                   <select className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-8">
                    <option>All Lines</option>
                    <option>Line A</option>
                    <option>Line B</option>
                  </select>
                </div>
              )}
              {lineId && (
                 <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm flex items-center">
                   <Filter size={16} className="mr-2" /> Filter Active
                 </div>
              )}
              {/* Removed View Settings button */}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeEquipmentList.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
                No equipment found for this line.
              </div>
            ) : (
              activeEquipmentList.map((equip) => (
                <div key={equip.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${equip.status === MachineStatus.Running ? 'bg-green-500 animate-pulse' : equip.status === MachineStatus.Warning ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                      <h3 className="font-bold text-slate-800">{equip.name}</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400">#{equip.id}</span>
                  </div>
                  
                  <div className="p-5">
                    {equip.description && (
                      <p className="text-sm text-slate-500 mb-4">{equip.description}</p>
                    )}
                    <div className="flex items-center mb-4">
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-100 font-medium">
                        {equip.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-slate-500">
                          <Thermometer size={14} className="mr-1" /> 溫度
                        </div>
                        <div className="text-xl font-bold text-slate-800">{equip.temperature}°C</div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full">
                          <div 
                            className={`h-1.5 rounded-full ${equip.temperature > 60 ? 'bg-red-500' : 'bg-blue-500'}`} 
                            style={{ width: `${Math.min(equip.temperature, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-slate-500">
                          <Activity size={14} className="mr-1" /> 震動
                        </div>
                        <div className="text-xl font-bold text-slate-800">{equip.vibration} mm/s</div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full">
                          <div 
                            className={`h-1.5 rounded-full ${equip.vibration > 1.5 ? 'bg-orange-500' : 'bg-green-500'}`} 
                            style={{ width: `${Math.min(equip.vibration * 20, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100">
                      <div className="flex items-center text-slate-500">
                        <Clock size={14} className="mr-1.5" />
                        維護: {equip.lastMaintenance}
                      </div>
                      <button 
                        onClick={() => onMaintainDevice && onMaintainDevice(equip.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-xs uppercase tracking-wide hover:underline"
                      >
                        <Settings size={14} className="mr-1" /> 維護設備
                      </button>
                    </div>
                  </div>
                  
                  {/* Hover overlay for quick actions */}
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 w-0 group-hover:w-full transition-all duration-300"></div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        // --- Database Structure View ---
        <div className="animate-in fade-in duration-300 h-[calc(100vh-250px)] flex flex-col md:flex-row gap-6">
          
          {/* Left Sidebar: Table List */}
          <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
              <h3 className="font-bold text-slate-800 flex items-center">
                <List size={18} className="mr-2 text-slate-500" />
                數據表列表
              </h3>
            </div>
            <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
              <div className="space-y-1">
                {tables.map(table => (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTableId(table.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between
                      ${selectedTableId === table.id 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center truncate">
                      <TableIcon size={16} className={`mr-2 ${selectedTableId === table.id ? 'text-blue-500' : 'text-slate-400'}`} />
                      <span className="truncate">{table.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-xl">
              <button 
                onClick={() => setIsTableModalOpen(true)}
                className="w-full py-2 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded hover:bg-slate-50 transition-colors flex items-center justify-center"
              >
                <Plus size={14} className="mr-1" /> 新建表
              </button>
            </div>
          </div>

          {/* Right Panel: Table Structure Detail */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            {selectedTable ? (
              <>
                {/* Table Header Info */}
                <div className="p-6 border-b border-slate-200 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                        {selectedTable.name}
                        <span className="ml-3 px-2 py-0.5 rounded text-xs font-normal bg-slate-100 text-slate-500 border border-slate-200">
                          {selectedTable.engine}
                        </span>
                      </h2>
                      <p className="text-sm text-slate-500 mt-1 flex items-center">
                        <Database size={14} className="mr-1" /> Schema: public • {selectedTable.rowCount.toLocaleString()} rows
                      </p>
                    </div>
                    <div className="flex space-x-2">
                       <div className="relative">
                         <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                         <input 
                           type="text" 
                           placeholder="Filter columns..." 
                           className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                         />
                       </div>
                    </div>
                  </div>
                </div>

                {/* Columns Table */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Name</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Type</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-center">Key</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-center">Nullable</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Default</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedTable.columns.map((col, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 group transition-colors">
                          <td className="px-6 py-3">
                            <span className="font-mono text-sm font-medium text-slate-700">{col.name}</span>
                          </td>
                          <td className="px-6 py-3">
                            <span className="text-sm text-blue-600 font-mono">
                              {col.type}{col.length ? `(${col.length})` : ''}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            {col.isPk && <Key size={14} className="mx-auto text-yellow-500" />}
                          </td>
                          <td className="px-6 py-3 text-center">
                            {col.notNull ? (
                              <span className="text-xs font-bold text-slate-400">NO</span>
                            ) : (
                              <span className="text-xs text-slate-400">YES</span>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            <span className="text-sm text-slate-500 font-mono">{col.defaultValue || 'NULL'}</span>
                          </td>
                          <td className="px-6 py-3 text-right">
                             <button className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Settings size={14} />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                 <TableIcon size={48} className="mb-4 opacity-20" />
                 <p>Select a table to view its structure</p>
               </div>
            )}
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">新增設備實例</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  設備類型 <span className="text-red-500">*</span>
                </label>
                <select
                  value={newEquipData.type}
                  onChange={(e) => setNewEquipData({...newEquipData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="組裝設備">組裝設備</option>
                  <option value="AGV小車">AGV小車</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  設備名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newEquipData.name}
                  onChange={(e) => setNewEquipData({...newEquipData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="例如: Robotic Arm Alpha"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  功能描述
                </label>
                <textarea
                  value={newEquipData.description}
                  onChange={(e) => setNewEquipData({...newEquipData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  placeholder="簡要描述該設備的主要功能..."
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleAddEquipment}
                disabled={!newEquipData.name.trim()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm
                  ${newEquipData.name.trim() 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-400 cursor-not-allowed opacity-70'
                  }`}
              >
                確定新增
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {isTableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center">
                <TableIcon size={20} className="mr-2 text-blue-600" />
                新建數據庫表
              </h3>
              <button 
                onClick={() => setIsTableModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    表名稱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTableData.name}
                    onChange={(e) => setNewTableData({...newTableData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g. device_readings"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    存儲引擎
                  </label>
                  <select
                    value={newTableData.engine}
                    onChange={(e) => setNewTableData({...newTableData, engine: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="InnoDB">InnoDB (Default)</option>
                    <option value="MyISAM">MyISAM</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">列定義</label>
                  <button 
                    onClick={handleAddColumnRow}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center px-2 py-1 bg-blue-50 rounded"
                  >
                    <Plus size={12} className="mr-1" /> 添加列
                  </button>
                </div>
                
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                      <tr>
                        <th className="px-4 py-2 font-semibold">列名</th>
                        <th className="px-4 py-2 font-semibold">類型</th>
                        <th className="px-4 py-2 font-semibold text-center w-16">PK</th>
                        <th className="px-4 py-2 font-semibold text-center w-16">NN</th>
                        <th className="px-2 py-2 font-semibold w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {newTableColumns.map((col, idx) => (
                        <tr key={col.id} className="group hover:bg-slate-50">
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={col.name}
                              onChange={(e) => updateColumnRow(col.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-sm focus:outline-none"
                              placeholder="col_name"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <select
                              value={col.type}
                              onChange={(e) => updateColumnRow(col.id, 'type', e.target.value)}
                              className="w-full px-2 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 rounded text-sm bg-transparent focus:outline-none"
                            >
                              <option value="INT">INT</option>
                              <option value="BIGINT">BIGINT</option>
                              <option value="VARCHAR">VARCHAR</option>
                              <option value="TEXT">TEXT</option>
                              <option value="DATETIME">DATETIME</option>
                              <option value="BOOLEAN">BOOLEAN</option>
                            </select>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={col.isPk}
                              onChange={(e) => updateColumnRow(col.id, 'isPk', e.target.checked)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-2 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={col.notNull}
                              onChange={(e) => updateColumnRow(col.id, 'notNull', e.target.checked)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-2 py-2 text-center">
                            {newTableColumns.length > 1 && (
                              <button 
                                onClick={() => handleRemoveColumnRow(col.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-400 mt-2">PK: Primary Key, NN: Not Null</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setIsTableModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleCreateTable}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                確定創建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentManagement;
