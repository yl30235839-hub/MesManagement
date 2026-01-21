
import React, { useState } from 'react';
import { MOCK_LINES } from '../constants';
import { MachineStatus, ProductionLine } from '../types';
import { PlayCircle, StopCircle, AlertTriangle, Settings, Plus, Monitor, X, Layers } from 'lucide-react';

interface LineManagementProps {
  onViewEquipment: (lineId: string) => void;
}

const LineManagement: React.FC<LineManagementProps> = ({ onViewEquipment }) => {
  const [lines, setLines] = useState<ProductionLine[]>(MOCK_LINES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLineData, setNewLineData] = useState({ name: '', description: '', category: 'Vulkan-A' });

  const getStatusColor = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.Running: return 'bg-green-100 text-green-700 border-green-200';
      case MachineStatus.Stopped: return 'bg-red-100 text-red-700 border-red-200';
      case MachineStatus.Warning: return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100';
    }
  };

  const handleAddLine = () => {
    if (!newLineData.name.trim()) return;
    const newLine: ProductionLine = {
      id: `L${Math.floor(Math.random() * 10000)}`,
      factoryId: 'F1',
      name: newLineData.name,
      description: newLineData.description,
      category: newLineData.category,
      status: MachineStatus.Stopped,
      outputPerHour: 0,
      targetOutput: 1000,
    };
    setLines([...lines, newLine]);
    setIsModalOpen(false);
    setNewLineData({ name: '', description: '', category: 'Vulkan-A' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">工廠管理 - 産綫狀態</h3>
          <p className="text-sm text-slate-500">當前監控範圍：台北總廠</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm"
        >
          <Plus size={16} className="mr-1" /> 新增產綫實例
        </button>
      </div>

      <div className="grid gap-6">
        {lines.map((line) => (
          <div key={line.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <Layers size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800">{line.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs font-mono text-slate-400">ID: {line.id}</span>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">生產中</span>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center ${getStatusColor(line.status)}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${line.status === MachineStatus.Running ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {line.status}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">當前時產 (Units/Hr)</p>
                <div className="text-2xl font-bold text-slate-800">{line.outputPerHour} <span className="text-sm font-normal text-slate-400">/ {line.targetOutput}</span></div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3">
                  <div className="h-1.5 bg-green-500 rounded-full" style={{ width: `${(line.outputPerHour/line.targetOutput)*100}%` }}></div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">產線稼動率</p>
                <div className="text-2xl font-bold text-blue-600">{(line.outputPerHour/line.targetOutput*100).toFixed(1)}%</div>
                <p className="text-[10px] text-slate-400 mt-2">優於 85% 全球標準</p>
              </div>
              <div className="flex items-center justify-center">
                <button 
                  onClick={() => onViewEquipment(line.id)}
                  className="w-full md:w-auto px-8 py-3 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center hover:bg-slate-900 transition-all shadow-md active:scale-95"
                >
                  <Monitor size={18} className="mr-2" /> 進入設備管理
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">新增產綫實例</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">産綫名稱 *</label>
                <input type="text" value={newLineData.name} onChange={(e) => setNewLineData({...newLineData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl" placeholder="例如: Assembly Line B" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
                <textarea value={newLineData.description} onChange={(e) => setNewLineData({...newLineData, description: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl" placeholder="產線功能說明..." />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 font-medium">取消</button>
              <button onClick={handleAddLine} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">創建</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineManagement;
