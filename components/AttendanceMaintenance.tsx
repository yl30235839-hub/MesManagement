
import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Filter, Download, UserCheck, 
  UserX, Clock, Edit3, MoreVertical, ChevronLeft, 
  ChevronRight, FileText, UserPlus, CloudUpload, 
  Trash2, User, Users as UsersIcon, Calendar as CalendarIcon,
  X, CheckCircle, AlertCircle
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  lastCheckIn: string;
  status: 'NORMAL' | 'LATE' | 'ABSENT' | 'LEAVE';
  totalCheckIns: number;
}

interface Personnel {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  techLevel: string;
  entryDate: string;
}

const MOCK_RECORDS: AttendanceRecord[] = [
  { id: '1', name: '王大錘', employeeId: 'V001', department: '機構', lastCheckIn: '2024-03-20 08:02:15', status: 'NORMAL', totalCheckIns: 22 },
  { id: '2', name: '李小美', employeeId: 'V042', department: '電控', lastCheckIn: '2024-03-20 08:05:42', status: 'NORMAL', totalCheckIns: 21 },
  { id: '3', name: '張三', employeeId: 'V089', department: '視覺', lastCheckIn: '2024-03-20 08:12:01', status: 'LATE', totalCheckIns: 19 },
  { id: '4', name: '李四', employeeId: 'V112', department: '導入', lastCheckIn: '2024-03-19 08:00:22', status: 'ABSENT', totalCheckIns: 18 },
  { id: '5', name: '趙六', employeeId: 'V056', department: '機構', lastCheckIn: '2024-03-15 08:01:00', status: 'LEAVE', totalCheckIns: 15 },
];

const INITIAL_PERSONNEL: Personnel[] = [
  { id: 'p1', name: '王大錘', employeeId: 'V001', department: '機構', position: '工程師', techLevel: '3級(Level A)', entryDate: '2022-05-12' },
  { id: 'p2', name: '李小美', employeeId: 'V042', department: '電控', position: '高級工程師', techLevel: '開發', entryDate: '2021-03-10' },
  { id: 'p3', name: '張三', employeeId: 'V089', department: '視覺', position: '技術員', techLevel: '2級(Level B)', entryDate: '2023-01-15' },
  { id: 'p4', name: '李四', employeeId: 'V112', department: '導入', position: '實習生', techLevel: '1級(Level C)', entryDate: '2024-02-01' },
];

interface AttendanceMaintenanceProps {
  onBack: () => void;
  onGoToRegister: () => void;
}

const AttendanceMaintenance: React.FC<AttendanceMaintenanceProps> = ({ onBack, onGoToRegister }) => {
  const [activeView, setActiveView] = useState<'RECORDS' | 'PERSONNEL'>('RECORDS');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [personnelList, setPersonnelList] = useState<Personnel[]>(INITIAL_PERSONNEL);

  const handleUploadReport = () => {
    setIsUploading(true);
    // Simulate cloud upload
    setTimeout(() => {
      setIsUploading(false);
      alert('考勤數據已成功同步至雲端 MES 系統！');
    }, 2000);
  };

  const handleDeletePersonnel = (id: string) => {
    if (window.confirm('確定要刪除該人員信息嗎？相關指紋數據也將被同步移除。')) {
      setPersonnelList(prev => prev.filter(p => p.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NORMAL': return 'bg-green-100 text-green-700 border-green-200';
      case 'LATE': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'ABSENT': return 'bg-red-100 text-red-700 border-red-200';
      case 'LEAVE': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NORMAL': return '正常';
      case 'LATE': return '遲到';
      case 'ABSENT': return '缺勤';
      case 'LEAVE': return '請假';
      default: return status;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">考勤維護中心</h2>
            <p className="text-sm text-slate-500 mt-1">管理與維護產綫人員的指紋打卡記錄</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleUploadReport}
            disabled={isUploading}
            className={`flex items-center px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all ${isUploading ? 'opacity-50' : ''}`}
          >
            <CloudUpload size={16} className={`mr-2 ${isUploading ? 'animate-bounce' : ''}`} /> 
            {isUploading ? '正在上傳...' : '上傳報表'}
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
            <Download size={16} className="mr-2" /> 導出報表
          </button>
          {activeView === 'PERSONNEL' && (
            <button 
              onClick={onGoToRegister}
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
            >
              <UserPlus size={16} className="mr-2" /> 新增人員
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">今日應到</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-800">42 人</h3>
            <UserCheck className="text-blue-500" size={20} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">已到人數</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-green-600">38 人</h3>
            <span className="text-xs text-green-500 font-bold mb-1">90.4%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">異常打卡</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-orange-500">3 人</h3>
            <Clock className="text-orange-500" size={20} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">總人員數</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-800">{personnelList.length} 人</h3>
            <UsersIcon className="text-slate-400" size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 flex">
          <button 
            onClick={() => setActiveView('RECORDS')}
            className={`px-8 py-4 text-sm font-bold transition-all relative ${activeView === 'RECORDS' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            考勤記錄
            {activeView === 'RECORDS' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
          </button>
          <button 
            onClick={() => setActiveView('PERSONNEL')}
            className={`px-8 py-4 text-sm font-bold transition-all relative ${activeView === 'PERSONNEL' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            人員管理
            {activeView === 'PERSONNEL' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
          </button>
        </div>

        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={activeView === 'RECORDS' ? "搜索打卡記錄..." : "搜索姓名、工號或部門..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-300 rounded-lg hover:bg-white text-slate-500"><Filter size={18} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeView === 'RECORDS' ? (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">人員信息</th>
                  <th className="px-6 py-4">部門</th>
                  <th className="px-6 py-4">最近打卡時間</th>
                  <th className="px-6 py-4">考勤狀態</th>
                  <th className="px-6 py-4 text-center">本月打卡</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {MOCK_RECORDS.filter(r => r.name.includes(searchTerm) || r.employeeId.includes(searchTerm)).map((record) => (
                  <tr key={record.id} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                          {record.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{record.name}</div>
                          <div className="text-xs text-slate-400 font-mono">{record.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{record.department}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{record.lastCheckIn}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(record.status)}`}>
                        {getStatusLabel(record.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-blue-600">{record.totalCheckIns} 天</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="編輯詳情"><Edit3 size={16} /></button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">人員名稱</th>
                  <th className="px-6 py-4">部門/崗位</th>
                  <th className="px-6 py-4">工號</th>
                  <th className="px-6 py-4 text-center">技術等級</th>
                  <th className="px-6 py-4">入職日期</th>
                  <th className="px-6 py-4 text-right">管理操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {personnelList.filter(p => p.name.includes(searchTerm) || p.employeeId.includes(searchTerm)).map((person) => (
                  <tr key={person.id} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 mr-3">
                          <User size={18} />
                        </div>
                        <div className="font-bold text-slate-800">{person.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700 font-medium">{person.department}</div>
                      <div className="text-xs text-slate-400">{person.position}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-blue-600 font-semibold">{person.employeeId}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200">
                        {person.techLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{person.entryDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded transition-all"><Edit3 size={16} /></button>
                        <button 
                          onClick={() => handleDeletePersonnel(person.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>顯示當前共 {activeView === 'RECORDS' ? MOCK_RECORDS.length : personnelList.length} 條數據</span>
          <div className="flex items-center space-x-2">
            <button className="p-1.5 rounded border border-slate-300 hover:bg-white disabled:opacity-50" disabled><ChevronLeft size={14} /></button>
            <button className="w-8 h-8 rounded bg-blue-600 text-white font-bold">1</button>
            <button className="p-1.5 rounded border border-slate-300 hover:bg-white"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-blue-900 rounded-2xl text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center">
          <div className="p-3 bg-white/10 rounded-xl mr-6">
            <FileText size={32} />
          </div>
          <div>
            <h4 className="text-lg font-bold">自動化考勤分析</h4>
            <p className="text-blue-200 text-sm mt-1">基於最近 30 天數據，産線 A 人員穩定度為 98.2%，建議對異常打卡人員進行針對性溝通。</p>
          </div>
        </div>
        <button className="px-6 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors">
          查看詳情
        </button>
      </div>
    </div>
  );
};

export default AttendanceMaintenance;
