
import React, { useState } from 'react';
import { 
  ArrowLeft, FileWarning, Search, Filter, 
  Clock, Database, User, Save, CheckCircle, 
  ChevronRight, AlertCircle, Calendar, 
  CloudUpload, Trash2, Edit3, Tag,
  Activity, BarChart2
} from 'lucide-react';

interface FACAPendingItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  machineName: string;
  alarmCode: string;
  alarmContent: string;
  status: 'AWAITING' | 'ANALYZING' | 'COMPLETED';
}

const MOCK_PENDING: FACAPendingItem[] = [
  { id: 'F-20240320-001', date: '2024-03-20', startTime: '09:45:12', endTime: '10:15:30', machineName: 'Robotic Arm Beta', alarmCode: 'E-042', alarmContent: '伺服電機過載報警', status: 'AWAITING' },
  { id: 'F-20240320-002', date: '2024-03-20', startTime: '11:20:00', endTime: '11:25:00', machineName: 'CNC Milling Unit A', alarmCode: 'W-015', alarmContent: '切削液壓力低', status: 'AWAITING' },
  { id: 'F-20240319-015', date: '2024-03-19', startTime: '14:30:00', endTime: '15:45:00', machineName: 'Assembly Line A', alarmCode: 'S-001', alarmContent: '緊急停止觸發', status: 'ANALYZING' },
];

const CLASSIFICATION_OPTIONS = {
  level1: ['機械故障', '電器故障', '軟體錯誤', '工藝問題', '人為操作', '其他'],
  level2: ['伺服系統', '傳感器', '機構件損壞', '通訊中斷', 'PLC邏輯', '視覺系統'],
  level3: ['電機過熱', '線纜老化', '支架斷裂', '參數丟失', '網路丟包', '對焦偏移'],
  tags: ['緊急修復', '零件更換', '週期保養', '性能優化', '軟體補丁', '操作培訓']
};

interface FACAManagementProps {
  onBack: () => void;
}

const FACAManagement: React.FC<FACAManagementProps> = ({ onBack }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedItem = MOCK_PENDING.find(i => i.id === selectedId);

  // Form State
  const [facaForm, setFacaForm] = useState({
    handler: '張工程師',
    repairStart: '',
    repairEnd: '',
    cat1: '機械故障',
    cat2: '伺服系統',
    cat3: '電機過熱',
    tag1: '緊急修復',
    tag2: '零件更換'
  });

  const handleSelectItem = (item: FACAPendingItem) => {
    setSelectedId(item.id);
    // Initialize repair times based on fault times
    setFacaForm(prev => ({
      ...prev,
      repairStart: item.startTime,
      repairEnd: item.endTime
    }));
  };

  const handleSubmitFACA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`FACA 分析項目 ${selectedId} 已成功上傳雲端！`);
      setSelectedId(null);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">FACA 故障分析管理</h2>
            <p className="text-sm text-slate-500 mt-1">針對設備停機異常進行失效分析與改善追蹤</p>
          </div>
        </div>
        <button 
          onClick={() => alert('正在同步所有已上傳 FACA 數據...')}
          className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
        >
          <CloudUpload size={18} className="mr-2" /> 同步雲端歷史紀錄
        </button>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)] overflow-hidden">
        {/* Left: Pending List */}
        <div className="w-1/3 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center">
              <Clock size={18} className="mr-2 text-red-500" /> 待上傳列表
            </h3>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">{MOCK_PENDING.filter(i => i.status !== 'COMPLETED').length} 條異常</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
            {MOCK_PENDING.map(item => (
              <div 
                key={item.id} 
                onClick={() => handleSelectItem(item)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer group hover:shadow-md ${selectedId === item.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-[1.02]' : 'bg-white border-slate-100 text-slate-600'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${selectedId === item.id ? 'bg-blue-400 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {item.alarmCode}
                  </span>
                  <span className={`text-[10px] ${selectedId === item.id ? 'text-blue-100' : 'text-slate-400'} font-mono`}>{item.date}</span>
                </div>
                <h4 className={`font-bold text-sm ${selectedId === item.id ? 'text-white' : 'text-slate-800'}`}>{item.machineName}</h4>
                <p className={`text-xs mt-1 truncate ${selectedId === item.id ? 'text-blue-100' : 'text-slate-500'}`}>{item.alarmContent}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2 text-[10px]">
                    <Clock size={12} />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                  <ChevronRight size={14} className={selectedId === item.id ? 'text-white' : 'text-slate-300'} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Analysis Form */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {selectedId ? (
            <form onSubmit={handleSubmitFACA} className="flex-1 flex flex-col">
              <div className="p-6 border-b border-slate-200 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center">
                      <FileWarning size={22} className="mr-2 text-blue-600" /> FACA 錄入內容
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">分析編號: <span className="font-mono font-bold text-blue-600">{selectedId}</span></p>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    {isSubmitting ? <Activity className="animate-spin mr-2" size={18} /> : <CloudUpload size={18} className="mr-2" />}
                    提交 FACA 分析
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Section 1: Basic Fault Info */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">故障代碼</label>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono text-blue-700 font-bold">
                      {selectedItem?.alarmCode}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">處理人信息</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={facaForm.handler}
                        onChange={(e) => setFacaForm({...facaForm, handler: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder="輸入處理人姓名/工號"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">故障描述</label>
                  <textarea 
                    className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50/50 min-h-[80px]"
                    defaultValue={selectedItem?.alarmContent}
                    readOnly
                  ></textarea>
                </div>

                {/* Section 2: Time Management */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                    <h4 className="text-sm font-bold text-red-700 mb-4 flex items-center">
                      <Clock size={16} className="mr-2" /> 故障時間段
                    </h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <span className="text-[10px] text-red-400 font-bold uppercase">開始</span>
                        <div className="text-lg font-mono font-bold text-red-800">{selectedItem?.startTime}</div>
                      </div>
                      <div className="w-8 h-[2px] bg-red-200"></div>
                      <div className="flex-1">
                        <span className="text-[10px] text-red-400 font-bold uppercase">結束</span>
                        <div className="text-lg font-mono font-bold text-red-800">{selectedItem?.endTime}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                    <h4 className="text-sm font-bold text-green-700 mb-4 flex items-center">
                      <Activity size={16} className="mr-2" /> 維修時間段 (人工作業)
                    </h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <span className="text-[10px] text-green-400 font-bold uppercase">維修開始</span>
                        <input type="time" value={facaForm.repairStart} onChange={(e) => setFacaForm({...facaForm, repairStart: e.target.value})} className="w-full bg-transparent text-lg font-mono font-bold text-green-800 focus:ring-0 border-none p-0 outline-none" />
                      </div>
                      <div className="w-8 h-[2px] bg-green-200"></div>
                      <div className="flex-1">
                        <span className="text-[10px] text-green-400 font-bold uppercase">維修結束</span>
                        <input type="time" value={facaForm.repairEnd} onChange={(e) => setFacaForm({...facaForm, repairEnd: e.target.value})} className="w-full bg-transparent text-lg font-mono font-bold text-green-800 focus:ring-0 border-none p-0 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Classification */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center">
                    <Tag size={18} className="mr-2 text-blue-600" /> 異常分類體系
                  </h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">一級分類</label>
                      <select value={facaForm.cat1} onChange={(e) => setFacaForm({...facaForm, cat1: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm">
                        {CLASSIFICATION_OPTIONS.level1.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">二級分類</label>
                      <select value={facaForm.cat2} onChange={(e) => setFacaForm({...facaForm, cat2: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm">
                        {CLASSIFICATION_OPTIONS.level2.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">三級分類</label>
                      <select value={facaForm.cat3} onChange={(e) => setFacaForm({...facaForm, cat3: e.target.value})} className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm">
                        {CLASSIFICATION_OPTIONS.level3.map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <label className="block text-[10px] font-bold text-slate-400 mb-3 uppercase flex items-center">
                        <BarChart2 size={12} className="mr-1" /> 分類標籤 1
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {CLASSIFICATION_OPTIONS.tags.slice(0, 3).map(tag => (
                          <button 
                            key={tag} 
                            type="button" 
                            onClick={() => setFacaForm({...facaForm, tag1: tag})}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${facaForm.tag1 === tag ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <label className="block text-[10px] font-bold text-slate-400 mb-3 uppercase flex items-center">
                        <BarChart2 size={12} className="mr-1" /> 分類標籤 2
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {CLASSIFICATION_OPTIONS.tags.slice(3).map(tag => (
                          <button 
                            key={tag} 
                            type="button" 
                            onClick={() => setFacaForm({...facaForm, tag2: tag})}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${facaForm.tag2 === tag ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="p-8 bg-slate-50 rounded-full">
                <FileWarning size={64} className="text-slate-200" />
              </div>
              <p className="text-lg font-medium">請從左側列表中選擇一個待處理的異常項目</p>
              <p className="text-sm">錄入 FACA 將有助於減少重複故障並優化生產效率</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FACAManagement;
