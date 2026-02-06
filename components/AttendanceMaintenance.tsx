import React, { useState, useRef, useMemo } from 'react';
import api from '../services/api';
import { 
  ArrowLeft, Search, Filter, Download, UserCheck, 
  UserX, Clock, Edit3, MoreVertical, ChevronLeft, 
  ChevronRight, FileText, UserPlus, 
  Trash2, User, Users as UsersIcon, Calendar as CalendarIcon,
  X, CheckCircle, AlertCircle, RefreshCw, Star, Zap, ShieldCheck,
  FileUp, FileSpreadsheet, BarChart, Calendar, Info, Eye, XCircle
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
  extraPermissions: {
    keyPersonnel: boolean;
    mobilePersonnel: boolean;
  };
}

interface StatRow {
  period: string;
  expected: number;
  checkedIn: number;
  notCheckedIn: number;
}

interface DetailPerson {
  name: string;
  employeeId: string;
}

const MOCK_RECORDS: AttendanceRecord[] = [
  { id: '1', name: '王大錘', employeeId: 'V001', department: '機構', lastCheckIn: '2024-03-20 08:02:15', status: 'NORMAL', totalCheckIns: 22 },
  { id: '2', name: '李小美', employeeId: 'V042', department: '電控', lastCheckIn: '2024-03-20 08:05:42', status: 'NORMAL', totalCheckIns: 21 },
  { id: '3', name: '張三', employeeId: 'V089', department: '視覺', lastCheckIn: '2024-03-20 08:12:01', status: 'LATE', totalCheckIns: 19 },
  { id: '4', name: '李四', employeeId: 'V112', department: '導入', lastCheckIn: '2024-03-19 08:00:22', status: 'ABSENT', totalCheckIns: 18 },
  { id: '5', name: '趙六', employeeId: 'V056', department: '機構', lastCheckIn: '2024-03-15 08:01:00', status: 'LEAVE', totalCheckIns: 15 },
];

const INITIAL_PERSONNEL: Personnel[] = [
  { 
    id: 'p1', 
    name: '王大錘', 
    employeeId: 'V001', 
    department: '機構', 
    position: '工程師', 
    techLevel: '3級(Level A)', 
    extraPermissions: { keyPersonnel: true, mobilePersonnel: false } 
  },
  { 
    id: 'p2', 
    name: '李小美', 
    employeeId: 'V042', 
    department: '電控', 
    position: '高級工程師', 
    techLevel: '開發', 
    extraPermissions: { keyPersonnel: true, mobilePersonnel: true } 
  },
  { 
    id: 'p3', 
    name: '張三', 
    employeeId: 'V089', 
    department: '視覺', 
    position: '技術員', 
    techLevel: '2級(Level B)', 
    extraPermissions: { keyPersonnel: false, mobilePersonnel: true } 
  },
  { 
    id: 'p4', 
    name: '李四', 
    employeeId: 'V112', 
    department: '導入', 
    position: '實習生', 
    techLevel: '1級(Level C)', 
    extraPermissions: { keyPersonnel: false, mobilePersonnel: false } 
  },
];

interface AttendanceMaintenanceProps {
  lineId?: string | null;
  deviceId?: string | null;
  onBack: () => void;
  onGoToRegister: () => void;
}

const AttendanceMaintenance: React.FC<AttendanceMaintenanceProps> = ({ lineId, deviceId, onBack, onGoToRegister }) => {
  const [activeView, setActiveView] = useState<'RECORDS' | 'PERSONNEL' | 'STATISTICS'>('RECORDS');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [personnelList, setPersonnelList] = useState<Personnel[]>(INITIAL_PERSONNEL);
  const [records, setRecords] = useState<AttendanceRecord[]>(MOCK_RECORDS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Statistics State
  const [analysisDate, setAnalysisDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState<'DAY' | 'NIGHT'>('DAY');

  // Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [checkedInList, setCheckedInList] = useState<DetailPerson[]>([]);
  const [notCheckedInList, setNotCheckedInList] = useState<DetailPerson[]>([]);

  // Generate Time Periods based on Shift
  const statisticsData = useMemo(() => {
    const data: StatRow[] = [];
    if (shift === 'DAY') {
      const daySlots = [
        '08:00~09:00', '09:00~10:00', '10:00~11:00', '11:00~12:00', 
        '12:00~13:00', '13:00~14:00', '14:00~15:00', '15:00~16:00', 
        '16:00~17:00', '17:00~18:00', '18:00~19:00', '19:00~20:00'
      ];
      daySlots.forEach(slot => {
        data.push({
          period: slot,
          expected: 50,
          checkedIn: Math.floor(Math.random() * 15) + 35,
          notCheckedIn: 0
        });
      });
    } else {
      const nightSlots = [
        '20:00~21:00', '21:00~22:00', '22:00~23:00', '23:00~24:00', 
        '00:00~01:00', '01:00~02:00', '02:00~03:00', '03:00~04:00', 
        '04:00~05:00', '05:00~06:00', '06:00~07:00', '07:00~08:00'
      ];
      nightSlots.forEach(slot => {
        data.push({
          period: slot,
          expected: 35,
          checkedIn: Math.floor(Math.random() * 10) + 25,
          notCheckedIn: 0
        });
      });
    }
    
    // Calculate "Not Checked In"
    return data.map(row => ({
      ...row,
      notCheckedIn: row.expected - row.checkedIn
    }));
  }, [shift, analysisDate]);

  const handleShowDetails = (row: StatRow) => {
    setSelectedPeriod(row.period);
    
    // Generate Mock Checked-in Persons
    const names = ['王大錘', '李小美', '張三', '趙鐵柱', '陳阿輝', '周曉彤', '吳建國', '鄭如意'];
    const ids = ['V001', 'V042', 'V089', 'V099', 'V201', 'V156', 'V033', 'V077'];
    
    const checked: DetailPerson[] = [];
    for(let i=0; i<row.checkedIn && i<8; i++) {
        checked.push({ name: names[i] || `員工${i+1}`, employeeId: ids[i] || `V${100+i}` });
    }
    
    const notChecked: DetailPerson[] = [];
    for(let i=0; i<row.notCheckedIn && i<5; i++) {
        notChecked.push({ name: `缺勤者${i+1}`, employeeId: `X${500+i}` });
    }

    setCheckedInList(checked);
    setNotCheckedInList(notChecked);
    setIsDetailModalOpen(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      if (activeView === 'RECORDS') {
        const response = await api.post('https://localhost:7044/api/CheckIn/AttendanceDataRefresh', {
          linesysname: lineId || "",
          equipmentsysname: deviceId || ""
        });
        const { code, message, data } = response.data;
        if (code === 200 && Array.isArray(data)) {
          const updatedRecords: AttendanceRecord[] = data.map((item: any) => ({
            id: `rec-${item.EmployeeID}`,
            name: item.EmployeeName,
            employeeId: item.EmployeeID,
            department: item.Department,
            lastCheckIn: item.AccessTime,
            status: 'NORMAL',
            totalCheckIns: 0
          }));
          setRecords(updatedRecords);
        } else {
          alert(`考勤紀錄刷新失敗: ${message}`);
        }
      } else if (activeView === 'PERSONNEL') {
        const response = await api.post('https://localhost:7044/api/CheckIn/UserDataRefresh', {
          linesysname: lineId || '',
          equipmentsysname: deviceId || ''
        });
        const { code, message, data } = response.data;
        if (code === 200 && Array.isArray(data)) {
          const updatedPersonnel: Personnel[] = data.map((item: any) => ({
            id: item.UserJobNO,
            name: item.UserName,
            employeeId: item.UserJobNO,
            department: item.Vender,
            position: item.UserJobName,
            techLevel: item.UserLevel,
            extraPermissions: {
              keyPersonnel: item.KeyMan === '是' || item.KeyMan === true,
              mobilePersonnel: item.ActiveMan === '是' || item.ActiveMan === true
            }
          }));
          setPersonnelList(updatedPersonnel);
        } else {
          alert(`人員信息刷新失敗: ${message || '後端返回異常'}`);
        }
      }
    } catch (error: any) {
      if (error.message === 'Network Error') {
        alert('通訊異常：無法連線至後端 API (Network Error)。請確認 Port 7044 服務已啟動。');
      } else {
        alert(`刷新過程發生錯誤: ${error.message}`);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleBatchImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      alert('請上傳正確的 Excel 表格文件 (.xlsx, .xls)');
      return;
    }
    setIsImporting(true);
    setTimeout(() => {
      const importedData: Personnel[] = [
        { 
          id: `p-imp-${Date.now()}-1`, 
          name: '陳阿輝', 
          employeeId: 'V201', 
          department: '視覺', 
          position: '技術專家', 
          techLevel: '開發', 
          extraPermissions: { keyPersonnel: true, mobilePersonnel: false } 
        }
      ];
      setPersonnelList(prev => [...prev, ...importedData]);
      setIsImporting(false);
      alert(`成功導入 ${importedData.length} 位人員信息！`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);
  };

  const handleDeletePersonnel = (id: string) => {
    if (window.confirm('確定要刪除該人員信息嗎？相關指紋數據也將被同步移除。')) {
      setPersonnelList(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".xlsx, .xls" 
        className="hidden" 
      />

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
            {(lineId || deviceId) && (
              <p className="text-[10px] text-blue-500 font-mono mt-0.5">
                當前上下文：{lineId || 'N/A'} / {deviceId || '全部設備'}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        {/* Tab Header */}
        <div className="border-b border-slate-200 flex bg-slate-50/30">
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
          <button 
            onClick={() => setActiveView('STATISTICS')}
            className={`px-8 py-4 text-sm font-bold transition-all relative flex items-center ${activeView === 'STATISTICS' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <BarChart size={16} className="mr-2" />
            考勤統計
            {activeView === 'STATISTICS' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>}
          </button>
        </div>

        {/* View Content */}
        {activeView === 'STATISTICS' ? (
          <div className="flex-1 flex flex-col animate-in fade-in duration-500">
            {/* Filter Header for Statistics */}
            <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center gap-6">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">分析日期</label>
                <div className="relative">
                  <CalendarIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                  <input 
                    type="date" 
                    value={analysisDate}
                    onChange={(e) => setAnalysisDate(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">班次選擇</label>
                <div className="flex bg-slate-200 p-1 rounded-lg">
                  <button 
                    onClick={() => setShift('DAY')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${shift === 'DAY' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    白班
                  </button>
                  <button 
                    onClick={() => setShift('NIGHT')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${shift === 'NIGHT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    夜班
                  </button>
                </div>
              </div>
              <div className="ml-auto flex items-center text-xs text-slate-400">
                <Info size={14} className="mr-1 text-blue-400" />
                統計數據每 5 分鐘自動刷新
              </div>
            </div>

            {/* Statistics Table */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase font-bold tracking-widest border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-4">時間段 (Time Period)</th>
                    <th className="px-8 py-4">應到人數 (Expected)</th>
                    <th className="px-8 py-4">已打卡 (Clocked In)</th>
                    <th className="px-8 py-4">未打卡 (Not Clocked In)</th>
                    <th className="px-8 py-4 text-center">到崗率 (Rate)</th>
                    <th className="px-8 py-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {statisticsData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center text-slate-700 font-bold">
                          <Clock size={14} className="mr-2 text-blue-400" />
                          {row.period}
                        </div>
                      </td>
                      <td className="px-8 py-4 font-mono text-slate-500 font-bold">{row.expected} 人</td>
                      <td className="px-8 py-4 font-mono text-green-600 font-bold">{row.checkedIn} 人</td>
                      <td className="px-8 py-4">
                        <span className={`font-mono font-bold ${row.notCheckedIn > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                          {row.notCheckedIn} 人
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-blue-600">
                            {((row.checkedIn / row.expected) * 100).toFixed(1)}%
                          </span>
                          <div className="w-24 h-1 bg-slate-100 rounded-full mt-1">
                            <div 
                              className="h-1 bg-blue-500 rounded-full" 
                              style={{ width: `${(row.checkedIn / row.expected) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button 
                            onClick={() => handleShowDetails(row)}
                            className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center justify-end ml-auto group/btn"
                        >
                            <Eye size={14} className="mr-1 group-hover/btn:scale-110 transition-transform" />
                            查看明細
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Statistics Footer Summary */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">總應到人數</p>
                  <p className="text-xl font-bold text-slate-800">{statisticsData.reduce((acc, curr) => acc + curr.expected, 0)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">累積已打卡</p>
                  <p className="text-xl font-bold text-green-600">{statisticsData.reduce((acc, curr) => acc + curr.checkedIn, 0)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">平均到崗率</p>
                  <p className="text-xl font-bold text-blue-600">
                    {((statisticsData.reduce((acc, curr) => acc + curr.checkedIn, 0) / statisticsData.reduce((acc, curr) => acc + curr.expected, 0)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <button className="flex items-center px-6 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-900 transition-all active:scale-95">
                <Download size={16} className="mr-2" /> 下載當前統計報表
              </button>
            </div>
          </div>
        ) : (
          <>
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
                <button 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  title={`刷新${activeView === 'RECORDS' ? '考勤記錄' : '人員管理'}`}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-white text-slate-500 hover:text-blue-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
                <button className="p-2 border border-slate-300 rounded-lg hover:bg-white text-slate-500"><Filter size={18} /></button>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              {activeView === 'RECORDS' ? (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">人員信息</th>
                      <th className="px-6 py-4">部門</th>
                      <th className="px-6 py-4">最近打卡時間</th>
                      <th className="px-6 py-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y divide-slate-100 text-sm transition-opacity duration-300 ${isRefreshing ? 'opacity-40' : 'opacity-100'}`}>
                    {records.filter(r => r.name.includes(searchTerm) || r.employeeId.includes(searchTerm)).map((record) => (
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
                      <th className="px-6 py-4 text-center">關鍵人力</th>
                      <th className="px-6 py-4 text-center">機動人力</th>
                      <th className="px-6 py-4 text-right">管理操作</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y divide-slate-100 text-sm transition-opacity duration-300 ${isRefreshing ? 'opacity-40' : 'opacity-100'}`}>
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
                        <td className="px-6 py-4 text-center">
                          {person.extraPermissions.keyPersonnel ? (
                            <div className="flex items-center justify-center text-amber-500" title="是">
                              <Star size={18} fill="currentColor" />
                            </div>
                          ) : (
                            <div className="text-slate-300 flex items-center justify-center" title="否">
                              <X size={16} />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {person.extraPermissions.mobilePersonnel ? (
                            <div className="flex items-center justify-center text-blue-500" title="是">
                              <Zap size={18} fill="currentColor" />
                            </div>
                          ) : (
                            <div className="text-slate-300 flex items-center justify-center" title="否">
                              <X size={16} />
                            </div>
                          )}
                        </td>
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
              <span>顯示當前共 {activeView === 'RECORDS' ? records.length : personnelList.length} 條數據</span>
              <div className="flex items-center space-x-2">
                <button className="p-1.5 rounded border border-slate-300 hover:bg-white disabled:opacity-50" disabled><ChevronLeft size={14} /></button>
                <button className="w-8 h-8 rounded bg-blue-600 text-white font-bold">1</button>
                <button className="p-1.5 rounded border border-slate-300 hover:bg-white"><ChevronRight size={14} /></button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Statistics Detail Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-8 py-5 bg-blue-600 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <BarChart size={22} />
                <div>
                    <h3 className="font-bold text-lg">考勤統計時段明細</h3>
                    <p className="text-blue-100 text-xs font-mono">{selectedPeriod}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden p-8 flex gap-8">
                {/* Left: Checked-in Personnel */}
                <div className="flex-1 flex flex-col bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-green-50 border-b border-green-100 flex items-center justify-between shrink-0">
                        <div className="flex items-center text-green-700 font-bold">
                            <CheckCircle size={18} className="mr-2" />
                            已打卡人員
                        </div>
                        <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {checkedInList.length} 人
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {checkedInList.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-100/50 text-[10px] text-slate-400 uppercase font-bold sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-2">姓名</th>
                                        <th className="px-4 py-2">工號</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {checkedInList.map((p, i) => (
                                        <tr key={i} className="hover:bg-white transition-colors group">
                                            <td className="px-4 py-3 text-sm font-bold text-slate-700">{p.name}</td>
                                            <td className="px-4 py-3 text-xs font-mono text-slate-400 group-hover:text-blue-500">{p.employeeId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8">
                                <UserCheck size={32} className="opacity-20 mb-2" />
                                <p className="text-xs">該時段暫無打卡紀錄</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Not Checked-in Personnel */}
                <div className="flex-1 flex flex-col bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-center justify-between shrink-0">
                        <div className="flex items-center text-red-700 font-bold">
                            <XCircle size={18} className="mr-2" />
                            未打卡人員
                        </div>
                        <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {notCheckedInList.length} 人
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {notCheckedInList.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-100/50 text-[10px] text-slate-400 uppercase font-bold sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-2">姓名</th>
                                        <th className="px-4 py-2">工號</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {notCheckedInList.map((p, i) => (
                                        <tr key={i} className="hover:bg-white transition-colors group">
                                            <td className="px-4 py-3 text-sm font-bold text-slate-700">{p.name}</td>
                                            <td className="px-4 py-3 text-xs font-mono text-slate-400 group-hover:text-red-500">{p.employeeId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8">
                                <UserX size={32} className="opacity-20 mb-2" />
                                <p className="text-xs">該時段全員已到崗</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="px-8 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-900 transition-all active:scale-95"
              >
                關閉窗口
              </button>
            </div>
          </div>
        </div>
      )}

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