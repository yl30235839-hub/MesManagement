
import React, { useState, useEffect } from 'react';
import { Equipment, MachineStatus } from '../types';
import { 
  ArrowLeft, Save, Activity, Settings, 
  Cpu, Zap, Database, Plug, Plus, Trash2, Server,
  Table as TableIcon, MapPin, X, ChevronRight, Edit3, Building, Hash, Fingerprint
} from 'lucide-react';

interface DeviceSettingsProps {
  device: Equipment | null;
  onSave: (updated: Equipment) => void;
  onBack: () => void;
}

type TabType = 'BASIC' | 'MAPPING' | 'AUXILIARY';

const DeviceSettings: React.FC<DeviceSettingsProps> = ({ device, onSave, onBack }) => {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('BASIC');
  
  // Local Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: MachineStatus.Stopped,
    sn: '',
    factoryArea: '',
    floor: '',
    fingerprintId: '1',
    ip: '192.168.1.100'
  });

  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name,
        description: device.description || '',
        status: device.status,
        sn: device.sn || device.id,
        factoryArea: device.factoryArea || '',
        floor: device.floor || '',
        fingerprintId: device.fingerprintId || '1',
        ip: '192.168.1.100'
      });
    }
  }, [device]);

  const handleSave = () => {
    if (!device) return;
    setSaving(true);
    
    const updatedDevice: Equipment = {
      ...device,
      name: formData.name,
      description: formData.description,
      status: formData.status,
      sn: formData.sn,
      factoryArea: formData.factoryArea,
      floor: formData.floor,
      fingerprintId: formData.fingerprintId
    };

    setTimeout(() => {
      onSave(updatedDevice);
      setSaving(false);
      alert('設備配置已成功保存！');
    }, 800);
  };

  if (!device) return <div className="p-8 text-center text-red-500">Device not found</div>;

  const renderBasicInfo = () => {
    const isClockInDevice = device.type === '打卡設備';

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center">
            <Server size={20} className="text-blue-600 mr-2" />
            <h3 className="text-lg font-bold text-slate-800">
              {isClockInDevice ? '打卡設備維護參數' : '設備基礎信息'}
            </h3>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {isClockInDevice ? (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <Building size={14} className="mr-1.5 text-blue-500" /> 廠區
                  </label>
                  <input
                    type="text"
                    value={formData.factoryArea}
                    onChange={(e) => setFormData({...formData, factoryArea: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="請輸入廠區名稱"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <MapPin size={14} className="mr-1.5 text-blue-500" /> 設備樓層
                  </label>
                  <input
                    type="text"
                    value={formData.floor}
                    onChange={(e) => setFormData({...formData, floor: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="請輸入樓層"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <Settings size={14} className="mr-1.5 text-blue-500" /> 打卡機名稱
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="請輸入打卡機名稱"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <Hash size={14} className="mr-1.5 text-blue-500" /> 設備 SN
                  </label>
                  <input
                    type="text"
                    value={formData.sn}
                    onChange={(e) => setFormData({...formData, sn: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                    placeholder="請輸入設備 SN"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <Fingerprint size={14} className="mr-1.5 text-blue-500" /> 指紋儀編號
                  </label>
                  <select
                    value={formData.fingerprintId}
                    onChange={(e) => setFormData({...formData, fingerprintId: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num.toString()}>{num}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">設備名稱</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">設備編號 (SN)</label>
                  <input type="text" value={formData.sn} onChange={(e) => setFormData({...formData, sn: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
                </div>
              </>
            )}
          </div>
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
            <button onClick={() => setActiveTab('BASIC')} className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'BASIC' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>基礎信息</button>
            <button className="px-6 py-4 text-sm font-medium border-b-2 border-transparent text-slate-400 cursor-not-allowed whitespace-nowrap">映射管理 (非打卡設備專用)</button>
         </div>
      </div>

      <div>
        {activeTab === 'BASIC' && renderBasicInfo()}
      </div>
    </div>
  );
};

export default DeviceSettings;
