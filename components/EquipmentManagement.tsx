
import React, { useState } from 'react';
import { MachineStatus, Equipment } from '../types';
import { 
  Thermometer, Activity, Wrench, Clock, Settings, Filter, 
  Database, Table as TableIcon, Plus, Trash2, Cpu, 
  Search, Key, List, X, GripVertical, Building, MapPin, Hash
} from 'lucide-react';

interface EquipmentManagementProps {
  lineId?: string | null;
  equipmentList: Equipment[];
  onAddEquipment: (equip: Equipment) => void;
  onMaintainDevice?: (deviceId: string) => void;
}

const EquipmentManagement: React.FC<EquipmentManagementProps> = ({ lineId, equipmentList, onAddEquipment, onMaintainDevice }) => {
  const [activeTab, setActiveTab] = useState<'STATUS' | 'DATABASE'>('STATUS');
  
  // Modal State for Adding Equipment
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEquipData, setNewEquipData] = useState({
    type: '組裝設備',
    name: '',
    description: '',
    factoryArea: '',
    floor: '',
    sn: ''
  });

  const activeEquipmentList = lineId 
    ? equipmentList.filter(e => e.lineId === lineId) 
    : equipmentList;

  const handleAddEquipment = () => {
    // Check required fields based on type
    if (newEquipData.type === '打卡設備') {
      if (!newEquipData.name.trim() || !newEquipData.factoryArea.trim() || !newEquipData.floor.trim() || !newEquipData.sn.trim()) {
        alert("請填寫所有打卡設備必要參數");
        return;
      }
    } else {
      if (!newEquipData.name.trim()) return;
    }

    const newId = `E${Math.floor(Math.random() * 10000)}`;
    
    const newEquip: Equipment = {
      id: newId,
      lineId: lineId || 'L1',
      name: newEquipData.name,
      type: newEquipData.type,
      description: newEquipData.description || (newEquipData.type === '打卡設備' ? '專用考勤終端' : ''),
      status: MachineStatus.Stopped,
      temperature: 20,
      vibration: 0,
      lastMaintenance: new Date().toISOString().split('T')[0],
      // Clock-in specific
      factoryArea: newEquipData.factoryArea,
      floor: newEquipData.floor,
      sn: newEquipData.sn,
      fingerprintId: '1' // Default
    };
    
    onAddEquipment(newEquip);
    setIsAddModalOpen(false);
    setNewEquipData({ type: '組裝設備', name: '', description: '', factoryArea: '', floor: '', sn: '' });
  };

  return (
    <div className="relative">
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
      </div>

      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">產綫設備詳情</h2>
            {lineId && <p className="text-sm text-slate-500 mt-1">當前產綫: <span className="font-mono font-bold text-blue-600">{lineId}</span></p>}
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center shadow-sm transition-colors"
          >
            <Plus size={16} className="mr-2" /> 新增設備實例
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeEquipmentList.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
              目前暫無設備。
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
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-100 font-medium">
                      {equip.type}
                    </span>
                    {equip.sn && <span className="ml-2 text-xs text-slate-400 font-mono">SN: {equip.sn}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-slate-500">
                        <Thermometer size={14} className="mr-1" /> 溫度
                      </div>
                      <div className="text-xl font-bold text-slate-800">{equip.temperature}°C</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-slate-500">
                        <Activity size={14} className="mr-1" /> 震動
                      </div>
                      <div className="text-xl font-bold text-slate-800">{equip.vibration} mm/s</div>
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
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 w-0 group-hover:w-full transition-all duration-300"></div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Equipment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">新增設備實例</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">設備類型 *</label>
                <select
                  value={newEquipData.type}
                  onChange={(e) => setNewEquipData({...newEquipData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="組裝設備">組裝設備</option>
                  <option value="AGV小車">AGV小車</option>
                  <option value="打卡設備">打卡設備</option>
                </select>
              </div>

              {newEquipData.type === '打卡設備' ? (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                      <Building size={14} className="mr-1.5 text-blue-500" /> 廠區 *
                    </label>
                    <input
                      type="text"
                      value={newEquipData.factoryArea}
                      onChange={(e) => setNewEquipData({...newEquipData, factoryArea: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例如: 台北總廠"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                      <MapPin size={14} className="mr-1.5 text-blue-500" /> 設備樓層 *
                    </label>
                    <input
                      type="text"
                      value={newEquipData.floor}
                      onChange={(e) => setNewEquipData({...newEquipData, floor: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例如: 3F-A區"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">打卡機名稱 *</label>
                    <input
                      type="text"
                      value={newEquipData.name}
                      onChange={(e) => setNewEquipData({...newEquipData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例如: 正門打卡機 01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                      <Hash size={14} className="mr-1.5 text-blue-500" /> 設備 SN *
                    </label>
                    <input
                      type="text"
                      value={newEquipData.sn}
                      onChange={(e) => setNewEquipData({...newEquipData, sn: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="SN-XXXX-XXXX"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">設備名稱 *</label>
                    <input
                      type="text"
                      value={newEquipData.name}
                      onChange={(e) => setNewEquipData({...newEquipData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例如: Robotic Arm Alpha"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg">取消</button>
              <button onClick={handleAddEquipment} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">確定新增</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentManagement;
