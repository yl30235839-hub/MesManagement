import React, { useState } from 'react';
import { MOCK_EQUIPMENT } from '../constants';
import { MachineStatus } from '../types';
import { 
  Thermometer, Activity, Wrench, Clock, Settings, Filter, 
  Database, Server, Save, Plus, Trash2, CheckCircle, Wifi, Monitor,
  Cpu
} from 'lucide-react';

interface EquipmentManagementProps {
  lineId?: string | null;
}

interface ColumnDef {
  id: string;
  name: string;
  type: string;
  isPk: boolean;
  notNull: boolean;
}

interface TableDef {
  name: string;
  columns: number;
  created: string;
}

const EquipmentManagement: React.FC<EquipmentManagementProps> = ({ lineId }) => {
  const [activeTab, setActiveTab] = useState<'STATUS' | 'DATABASE'>('STATUS');
  
  // Equipment Data
  const filteredEquipment = lineId 
    ? MOCK_EQUIPMENT.filter(e => e.lineId === lineId) 
    : MOCK_EQUIPMENT;

  // Database Connection State
  const [dbConfig, setDbConfig] = useState({ 
    ip: '192.168.1.100', 
    port: '3306', 
    username: 'admin', 
    password: '', 
    dbName: 'mes_core' 
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);

  // Table Designer State
  const [existingTables, setExistingTables] = useState<TableDef[]>([
    { name: 'equipment_logs', columns: 5, created: '2023-10-15' },
    { name: 'production_metrics', columns: 8, created: '2023-11-02' },
    { name: 'users', columns: 6, created: '2023-09-10' }
  ]);
  const [newTableName, setNewTableName] = useState('');
  const [newColumns, setNewColumns] = useState<ColumnDef[]>([
    { id: '1', name: 'id', type: 'INT', isPk: true, notNull: true }
  ]);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsDbConnected(true);
    }, 1500);
  };

  const handleAddColumn = () => {
    const newId = (parseInt(newColumns[newColumns.length - 1].id) + 1).toString();
    setNewColumns([...newColumns, { id: newId, name: '', type: 'VARCHAR', isPk: false, notNull: false }]);
  };

  const handleRemoveColumn = (id: string) => {
    if (newColumns.length > 1) {
      setNewColumns(newColumns.filter(c => c.id !== id));
    }
  };

  const handleUpdateColumn = (id: string, field: keyof ColumnDef, value: any) => {
    setNewColumns(newColumns.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSaveTable = () => {
    if (!newTableName) {
      alert("請輸入表名");
      return;
    }
    setExistingTables([...existingTables, { name: newTableName, columns: newColumns.length, created: new Date().toISOString().split('T')[0] }]);
    setNewTableName('');
    setNewColumns([{ id: '1', name: 'id', type: 'INT', isPk: true, notNull: true }]);
    alert("表結構已保存");
  };

  return (
    <div>
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
          數據庫配置管理
        </button>
      </div>

      {activeTab === 'STATUS' ? (
        // --- Existing Equipment Monitoring View ---
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">產綫設備詳情</h2>
              {lineId && <p className="text-sm text-slate-500 mt-1">當前產綫: <span className="font-mono font-bold text-blue-600">{lineId}</span></p>}
            </div>
            <div className="flex space-x-2">
              {!lineId && (
                <select className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                  <option>All Lines</option>
                  <option>Line A</option>
                  <option>Line B</option>
                </select>
              )}
              {lineId && (
                 <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm flex items-center">
                   <Filter size={16} className="mr-2" /> Filter Active
                 </div>
              )}
              <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-lg text-sm flex items-center">
                <Settings size={16} className="mr-2" /> 配置視圖
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEquipment.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
                No equipment found for this line.
              </div>
            ) : (
              filteredEquipment.map((equip) => (
                <div key={equip.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${equip.status === MachineStatus.Running ? 'bg-green-500 animate-pulse' : equip.status === MachineStatus.Warning ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                      <h3 className="font-bold text-slate-800">{equip.name}</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400">#{equip.id}</span>
                  </div>
                  
                  <div className="p-5">
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
                      <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-xs uppercase tracking-wide">
                        <Wrench size={14} className="mr-1" /> 維護記錄
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
        // --- Database Management View ---
        <div className="animate-in fade-in duration-300 space-y-6">
          <div className="flex justify-between items-start">
             <div>
              <h2 className="text-xl font-bold text-slate-800">數據庫連接配置</h2>
              <p className="text-sm text-slate-500 mt-1">配置工業物聯網數據庫連接參數及表結構</p>
             </div>
             {isDbConnected && (
               <span className="flex items-center px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                 <Wifi size={16} className="mr-2" /> 已連接
               </span>
             )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Connection Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
              <div className="flex items-center mb-4 text-slate-800 font-bold">
                <Server size={20} className="mr-2 text-blue-600" />
                連接參數
              </div>
              <form onSubmit={handleConnect} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Host IP</label>
                    <input 
                      type="text" 
                      value={dbConfig.ip}
                      onChange={(e) => setDbConfig({...dbConfig, ip: e.target.value})}
                      className="w-full rounded border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Port</label>
                    <input 
                      type="text" 
                      value={dbConfig.port}
                      onChange={(e) => setDbConfig({...dbConfig, port: e.target.value})}
                      className="w-full rounded border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Database Name</label>
                  <input 
                    type="text" 
                    value={dbConfig.dbName}
                    onChange={(e) => setDbConfig({...dbConfig, dbName: e.target.value})}
                    className="w-full rounded border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Username</label>
                    <input 
                      type="text" 
                      value={dbConfig.username}
                      onChange={(e) => setDbConfig({...dbConfig, username: e.target.value})}
                      className="w-full rounded border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      value={dbConfig.password}
                      onChange={(e) => setDbConfig({...dbConfig, password: e.target.value})}
                      className="w-full rounded border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="••••••"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isConnecting || isDbConnected}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all
                    ${isDbConnected 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                    } ${isConnecting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isConnecting ? 'Connecting...' : isDbConnected ? 'Connected' : 'Connect to Database'}
                </button>
              </form>

              {/* Existing Tables List (Mock) */}
              {isDbConnected && (
                <div className="mt-8 border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-3">現有表結構</h4>
                  <div className="space-y-2">
                    {existingTables.map((table, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200 transition-colors">
                        <div className="flex items-center">
                          <Database size={14} className="mr-2 text-slate-400" />
                          <span className="text-sm text-slate-700">{table.name}</span>
                        </div>
                        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{table.columns} cols</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Table Designer */}
            <div className={`xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col ${!isDbConnected ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
              <div className="p-6 border-b border-slate-200 bg-slate-50 rounded-t-xl flex justify-between items-center">
                <div className="flex items-center">
                   <Plus size={20} className="mr-2 text-blue-600" />
                   <h3 className="font-bold text-slate-800">新建數據表</h3>
                </div>
                <button 
                  onClick={handleSaveTable}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Save size={16} className="mr-2" /> 保存表結構
                </button>
              </div>

              <div className="p-6 flex-1">
                <div className="mb-6">
                   <label className="block text-sm font-medium text-slate-700 mb-1">表名稱 (Table Name)</label>
                   <input 
                      type="text" 
                      value={newTableName}
                      onChange={(e) => setNewTableName(e.target.value)}
                      placeholder="e.g. sensor_data_2024"
                      className="w-full max-w-md rounded-lg border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Column Name</th>
                        <th className="px-4 py-3 font-semibold">Data Type</th>
                        <th className="px-4 py-3 font-semibold text-center w-20">PK</th>
                        <th className="px-4 py-3 font-semibold text-center w-20">Not Null</th>
                        <th className="px-4 py-3 font-semibold w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {newColumns.map((col) => (
                        <tr key={col.id} className="group hover:bg-slate-50">
                          <td className="px-4 py-2">
                            <input 
                              type="text" 
                              value={col.name}
                              onChange={(e) => handleUpdateColumn(col.id, 'name', e.target.value)}
                              placeholder="column_name"
                              className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 outline-none text-sm py-1"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <select 
                              value={col.type}
                              onChange={(e) => handleUpdateColumn(col.id, 'type', e.target.value)}
                              className="w-full bg-transparent text-sm py-1 outline-none text-slate-700"
                            >
                              <option value="INT">INT</option>
                              <option value="VARCHAR">VARCHAR</option>
                              <option value="TEXT">TEXT</option>
                              <option value="DATETIME">DATETIME</option>
                              <option value="BOOLEAN">BOOLEAN</option>
                              <option value="FLOAT">FLOAT</option>
                            </select>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <input 
                              type="checkbox" 
                              checked={col.isPk}
                              onChange={(e) => handleUpdateColumn(col.id, 'isPk', e.target.checked)}
                              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                          </td>
                          <td className="px-4 py-2 text-center">
                            <input 
                              type="checkbox" 
                              checked={col.notNull}
                              onChange={(e) => handleUpdateColumn(col.id, 'notNull', e.target.checked)}
                              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                             <button 
                               onClick={() => handleRemoveColumn(col.id)}
                               className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                             >
                               <Trash2 size={16} />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <button 
                    onClick={handleAddColumn}
                    className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 text-sm font-medium flex items-center justify-center border-t border-slate-200 transition-colors"
                  >
                    <Plus size={16} className="mr-2" /> Add Column
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentManagement;