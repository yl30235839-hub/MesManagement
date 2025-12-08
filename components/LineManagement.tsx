import React from 'react';
import { MOCK_LINES } from '../constants';
import { MachineStatus } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PlayCircle, StopCircle, AlertTriangle, Settings, Plus, Monitor } from 'lucide-react';

interface LineManagementProps {
  onViewEquipment: (lineId: string) => void;
}

const LineManagement: React.FC<LineManagementProps> = ({ onViewEquipment }) => {
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

  // Mock chart data
  const chartData = [
    { name: '08:00', output: 400 },
    { name: '09:00', output: 300 },
    { name: '10:00', output: 550 },
    { name: '11:00', output: 480 },
    { name: '12:00', output: 200 },
    { name: '13:00', output: 450 },
    { name: '14:00', output: 500 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Line List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">工廠生產綫列表</h3>
            <button 
              onClick={() => alert('新增產綫功能開發中')} 
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
            {MOCK_LINES.map((line) => (
              <div key={line.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-bold text-slate-800">{line.name}</h4>
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">ID: {line.id}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">所屬工廠: {line.factoryId}</p>
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
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded border border-slate-200">查看排程</button>
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

        {/* Right Side: Charts */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 h-80">
            <h3 className="text-sm font-bold text-slate-700 mb-4">實時產能趨勢 (Line A)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="output" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-2">AI 預測分析</h3>
            <p className="text-indigo-200 text-sm mb-4">基於當前運行數據，系統檢測到 Line B 可能在 4 小時後出現供料瓶頸。</p>
            <div className="flex items-center justify-between mt-6">
              <span className="text-xs font-mono bg-indigo-800 px-2 py-1 rounded">Confidence: 89%</span>
              <button className="text-sm font-medium hover:text-indigo-300">查看建議 &rarr;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineManagement;