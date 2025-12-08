
import React, { useState } from 'react';
import { MOCK_LINES } from '../constants';
import { MachineStatus, ProductionLine } from '../types';
import { PlayCircle, StopCircle, AlertTriangle, Settings, Plus, Monitor, X } from 'lucide-react';

interface LineManagementProps {
  onViewEquipment: (lineId: string) => void;
}

const LineManagement: React.FC<LineManagementProps> = ({ onViewEquipment }) => {
  // State for lines list to allow adding new ones
  const [lines, setLines] = useState<ProductionLine[]>(MOCK_LINES);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLineData, setNewLineData] = useState({ name: '', description: '', category: 'Vulkan-A' });

  const getStatusColor = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.Running: return 'bg-green-100 text-green-700 border-green-200';
      case MachineStatus.Stopped: return 'bg-red-100 text-red-700 border-red-200';
      case MachineStatus.Warning: return 'bg-orange-100 text-orange-700 border-orange-200';
      case MachineStatus.Maintenance: return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-100';
    }
  };

  const getStatusIcon = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.Running: return <PlayCircle size={16} className="mr-1" />;
      case MachineStatus.Stopped: return <StopCircle size={16} className="mr-1" />;
      case MachineStatus.Warning: return <AlertTriangle size={16} className="mr-1" />;
      default: return <Settings size={16} className="mr-1" />;
    }
  };

  const handleAddLine = () => {
    if (!newLineData.name.trim()) return;

    const newLine: ProductionLine = {
      id: `L${Math.floor(Math.random() * 10000)}`,
      factoryId: 'F1', // Default factory
      name: newLineData.name,
      description: newLineData.description,
      category: newLineData.category,
      status: MachineStatus.Stopped,
      outputPerHour: 0,
      targetOutput: 1000, // Default target
    };

    setLines([...lines, newLine]);
    setIsModalOpen(false);
    setNewLineData({ name: '', description: '', category: 'Vulkan-A' });
  };

  return (
    <div className="space-y-6 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Line List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">工廠生產綫列表</h3>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm transition-colors"
            >
              <Plus size={16} className="mr-1" /> 新增產綫
            </button>
          </div>
          
          <div className="flex justify-end mb-2 space-x-2">
            <span className="flex items-center text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> 正常</span>
            <span className="flex items-center text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span> 警告</span>
            <span className="flex items-center text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> 停機</span>
          </div>

          <div className="grid gap-4">
            {lines.map((line) => (
              <div key={line.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-bold text-slate-800">{line.name}</h4>
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">ID: {line.id}</span>
                      {line.category && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{line.category}</span>
                      )}
                    </div>
                    {/* Removed Factory ID display as requested */}
                    {line.description && (
                      <p className="text-xs text-slate-400 mt-2 italic">{line.description}</p>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center ${getStatusColor(line.status)}`}>
                    {getStatusIcon(line.status)}
                    {line.status}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">當前產能 (Units/Hr)</p>
                    <div className="flex items-end">
                      <span className="text-2xl font-bold text-slate-800">{line.outputPerHour}</span>
                      <span className="text-xs text-slate-400 mb-1 ml-2">/ {line.targetOutput} Target</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                      <div 
                        className={`h-1.5 rounded-full ${line.outputPerHour < line.targetOutput * 0.8 ? 'bg-orange-500' : 'bg-green-500'}`} 
                        style={{ width: `${Math.min((line.outputPerHour / line.targetOutput) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg flex flex-col justify-center items-center">
                    <p className="text-xs text-slate-500 mb-1">效率評分</p>
                    <span className="text-2xl font-bold text-blue-600">{Math.round((line.outputPerHour / line.targetOutput) * 100)}%</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  {/* Removed View Schedule button */}
                  <button 
                    onClick={() => onViewEquipment(line.id)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-slate-700 hover:bg-slate-800 rounded border border-slate-700 flex items-center"
                  >
                    <Monitor size={14} className="mr-1.5" />
                    設備管理
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: AI Prediction Only */}
        <div className="space-y-6">
          {/* Removed Real-time Capacity Trend Chart */}
          
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-lg sticky top-6">
            <h3 className="text-lg font-bold mb-2">AI 預測分析</h3>
            <p className="text-indigo-200 text-sm mb-4">基於當前運行數據，系統檢測到 Line B 可能在 4 小時後出現供料瓶頸。</p>
            <div className="flex items-center justify-between mt-6">
              <span className="text-xs font-mono bg-indigo-800 px-2 py-1 rounded">Confidence: 89%</span>
              <button className="text-sm font-medium hover:text-indigo-300">查看建議 &rarr;</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Line Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">新增生產綫</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  類別 <span className="text-red-500">*</span>
                </label>
                <select
                  value={newLineData.category}
                  onChange={(e) => setNewLineData({...newLineData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="Vulkan-A">Vulkan-A</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  綫體名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newLineData.name}
                  onChange={(e) => setNewLineData({...newLineData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="例如: SMT Assembly Line 3"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  功能描述
                </label>
                <textarea
                  value={newLineData.description}
                  onChange={(e) => setNewLineData({...newLineData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  placeholder="簡要描述該產綫的主要功能或生產品類..."
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-700">
                <p>新增的產綫將默認設置爲 "STOPPED" 狀態，並分配默認產能目標。請在創建後進行詳細配置。</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleAddLine}
                disabled={!newLineData.name.trim()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm
                  ${newLineData.name.trim() 
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
    </div>
  );
};

export default LineManagement;
