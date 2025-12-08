import React, { useState, useEffect } from 'react';
import { MOCK_EQUIPMENT } from '../constants';
import { Equipment, MachineStatus } from '../types';
import { ArrowLeft, Save, Activity, Thermometer, Settings, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

interface DeviceSettingsProps {
  deviceId: string | null;
  onBack: () => void;
}

const DeviceSettings: React.FC<DeviceSettingsProps> = ({ deviceId, onBack }) => {
  const [device, setDevice] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: MachineStatus.Stopped,
    maintenanceInterval: 30, // days
    thresholdTemp: 80,
    thresholdVib: 2.5
  });

  useEffect(() => {
    // Simulate fetching device details
    const foundDevice = MOCK_EQUIPMENT.find(e => e.id === deviceId);
    if (foundDevice) {
      setDevice(foundDevice);
      setFormData({
        name: foundDevice.name,
        description: foundDevice.description || '',
        status: foundDevice.status,
        maintenanceInterval: 30,
        thresholdTemp: 80,
        thresholdVib: 2.5
      });
    }
    setLoading(false);
  }, [deviceId]);

  const handleSave = () => {
    setSaving(true);
    // Simulate API save
    setTimeout(() => {
      setSaving(false);
      alert('設備配置已保存！');
    }, 800);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading device data...</div>;
  if (!device) return <div className="p-8 text-center text-red-500">Device not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">設備管理配置</h2>
            <div className="flex items-center text-sm text-slate-500 mt-1">
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 mr-2">ID: {device.id}</span>
              <span>{device.type}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-all active:scale-95 disabled:opacity-70"
        >
          {saving ? (
            <span className="flex items-center"><Activity className="animate-spin mr-2" size={18} /> 保存中...</span>
          ) : (
            <span className="flex items-center"><Save className="mr-2" size={18} /> 保存配置</span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Basic Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <FileText size={20} className="mr-2 text-blue-600" />
              基礎信息
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">設備名稱</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">功能描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">當前狀態</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as MachineStatus})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value={MachineStatus.Running}>RUNNING</option>
                  <option value={MachineStatus.Stopped}>STOPPED</option>
                  <option value={MachineStatus.Warning}>WARNING</option>
                  <option value={MachineStatus.Maintenance}>MAINTENANCE</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Settings size={20} className="mr-2 text-blue-600" />
              運行參數配置
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                  溫度報警閾值 (°C)
                  <span className="text-xs text-red-500 font-normal">Max: 120°C</span>
                </label>
                <div className="relative">
                  <Thermometer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    value={formData.thresholdTemp}
                    onChange={(e) => setFormData({...formData, thresholdTemp: parseInt(e.target.value)})}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                   震動報警閾值 (mm/s)
                   <span className="text-xs text-red-500 font-normal">Max: 10.0</span>
                </label>
                <div className="relative">
                  <Activity size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    step="0.1"
                    value={formData.thresholdVib}
                    onChange={(e) => setFormData({...formData, thresholdVib: parseFloat(e.target.value)})}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-lg flex items-start">
               <AlertTriangle size={20} className="text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
               <div className="text-sm text-orange-800">
                 <p className="font-bold mb-1">參數修改警告</p>
                 <p>修改運行參數閾值可能會影響設備的自動停機機制。請確保輸入的數值符合製造商的安全規範。</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Col: Maintenance Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">維護計劃</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">上次維護</p>
                <p className="text-lg font-bold text-slate-800">{device.lastMaintenance}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">維護周期 (天)</label>
                <input
                  type="number"
                  value={formData.maintenanceInterval}
                  onChange={(e) => setFormData({...formData, maintenanceInterval: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button className="w-full py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm">
                  查看完整維護日誌
                </button>
                <button className="w-full mt-2 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm">
                  下載設備手冊 (PDF)
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="font-bold text-lg mb-2 flex items-center">
              <CheckCircle size={20} className="mr-2" />
              健康狀態
            </h3>
            <div className="text-indigo-100 text-sm mb-4">
              AI 預測模型顯示該設備在未來 14 天內運行穩定的概率為 98%。
            </div>
            <div className="w-full bg-indigo-900/30 rounded-full h-2 mb-1">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: '98%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-indigo-200">
              <span>需關注</span>
              <span>健康</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceSettings;