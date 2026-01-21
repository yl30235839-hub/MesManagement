
import React, { useState } from 'react';
import { 
  User, IdCard, Building2, Briefcase, GraduationCap, 
  Lock, ArrowLeft, CheckCircle, 
  Fingerprint, Scan, ShieldCheck, Info, Eye, EyeOff,
  UserCheck, Zap, Monitor, Settings, CheckSquare, Square
} from 'lucide-react';

interface RegisterPageProps {
  onBack: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    department: '',
    position: '機構',
    techLevel: '1級(Level C)',
    permission: '操作員',
    password: '',
    extraPermissions: {
      keyPersonnel: false,
      mobilePersonnel: false,
      hostSoftware: false,
      equipmentOp: false
    }
  });

  // Fingerprint Registration State
  const [isRegisteringFinger, setIsRegisteringFinger] = useState(false);
  const [isFingerRegistered, setIsFingerRegistered] = useState(false);
  const [fingerprintImage, setFingerprintImage] = useState<string | null>(null);
  const [fingerprintStatus, setFingerprintStatus] = useState('等待登記...');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate registration
    setTimeout(() => {
      setLoading(false);
      alert('註冊成功！請使用新賬號登入。');
      onBack();
    }, 1500);
  };

  const toggleExtraPermission = (key: keyof typeof formData.extraPermissions) => {
    setFormData({
      ...formData,
      extraPermissions: {
        ...formData.extraPermissions,
        [key]: !formData.extraPermissions[key]
      }
    });
  };

  const startFingerprintRegistration = () => {
    setIsRegisteringFinger(true);
    setIsFingerRegistered(false);
    setFingerprintImage(null);
    setFingerprintStatus('開始采集指紋，請按下第1次手指');

    setTimeout(() => {
      setFingerprintStatus('請按下第2次手指...');
      setTimeout(() => {
        setFingerprintStatus('請按下第3次手指...');
        setTimeout(() => {
          setIsRegisteringFinger(false);
          setIsFingerRegistered(true);
          setFingerprintStatus('指紋登記成功！');
          setFingerprintImage('https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=200&h=200');
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const verifyFingerprint = () => {
    if (!isFingerRegistered) return;
    setFingerprintStatus('正在驗證指紋，請按下手指...');
    setTimeout(() => {
      setFingerprintStatus('指紋驗證通過！匹配度：99.8%');
    }, 800);
  };

  const extraPermsList = [
    { id: 'keyPersonnel', label: '關鍵人力', icon: UserCheck },
    { id: 'mobilePersonnel', label: '機動人力', icon: Zap },
    { id: 'hostSoftware', label: '上位機軟件', icon: Monitor },
    { id: 'equipmentOp', label: '設備操作權限', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">新用戶註冊</h2>
            <p className="text-blue-100 text-sm mt-1">請填寫以下信息完成 MES 系統賬號註冊</p>
          </div>
          <Building2 size={32} className="opacity-40" />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column - Text Info */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <User size={14} className="mr-1.5 text-blue-500" /> 姓名
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="請輸入真實姓名"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <IdCard size={14} className="mr-1.5 text-blue-500" /> 工號
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="請輸入工號"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <Building2 size={14} className="mr-1.5 text-blue-500" /> 部門
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Vulkan"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center">
                    <Briefcase size={14} className="mr-1.5 text-blue-500" /> 崗位
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
                  >
                    <option value="機構">機構</option>
                    <option value="電控">電控</option>
                    <option value="視覺">視覺</option>
                    <option value="導入">導入</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column - Biometrics / Fingerprint */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col items-center">
              <h3 className="text-sm font-bold text-slate-800 self-start mb-4 flex items-center">
                <Fingerprint size={16} className="mr-2 text-blue-600" /> 生物信息登記
              </h3>
              
              <div className="w-32 h-32 bg-white rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group mb-4">
                {fingerprintImage ? (
                  <img src={fingerprintImage} alt="Fingerprint" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <Fingerprint size={48} className={`text-slate-200 ${isRegisteringFinger ? 'animate-pulse text-blue-300' : ''}`} />
                )}
                {isRegisteringFinger && (
                  <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-blue-400 absolute animate-[bounce_2s_infinite]"></div>
                  </div>
                )}
              </div>

              <div className="w-full bg-slate-900 text-green-400 p-3 rounded-lg font-mono text-xs h-16 flex items-center mb-4 border border-slate-800 shadow-inner">
                <div className="flex items-start">
                  <span className="mr-2">$></span>
                  <span>{fingerprintStatus}</span>
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <button
                  type="button"
                  onClick={startFingerprintRegistration}
                  disabled={isRegisteringFinger}
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-sm
                    ${isRegisteringFinger ? 'bg-slate-200 text-slate-400' : 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                >
                  <Scan size={14} className="mr-1.5" /> 指紋登記
                </button>
                <button
                  type="button"
                  onClick={verifyFingerprint}
                  disabled={!isFingerRegistered || isRegisteringFinger}
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-sm
                    ${(!isFingerRegistered || isRegisteringFinger) ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  <ShieldCheck size={14} className="mr-1.5" /> 指紋驗證
                </button>
              </div>
            </div>

            {/* Additional Info Rows */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <GraduationCap size={14} className="mr-1.5 text-blue-500" /> 技術等級
              </label>
              <select
                value={formData.techLevel}
                onChange={(e) => setFormData({...formData, techLevel: e.target.value})}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all"
              >
                <option value="1級(Level C)">1級(Level C)</option>
                <option value="2級(Level B)">2級(Level B)</option>
                <option value="3級(Level A)">3級(Level A)</option>
                <option value="開發">開發</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <Lock size={14} className="mr-1.5 text-blue-500" /> 密碼
              </label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="請設置登入密碼"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Permission (Full Width) */}
            <div className="md:col-span-2 space-y-3 pt-4 border-t border-slate-100">
              <label className="text-sm font-semibold text-slate-700">操作權限</label>
              <div className="flex flex-wrap gap-4">
                {['操作員', '工程師', '管理員'].map((perm) => (
                  <label key={perm} className="flex items-center cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="radio"
                        name="permission"
                        className="sr-only"
                        checked={formData.permission === perm}
                        onChange={() => setFormData({...formData, permission: perm})}
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.permission === perm ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-slate-400'}`}>
                        {formData.permission === perm && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </div>
                    <span className={`ml-2 text-sm font-medium ${formData.permission === perm ? 'text-blue-700' : 'text-slate-600'}`}>
                      {perm}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Extra Permissions (Multi-select) */}
            <div className="md:col-span-2 space-y-3 pt-2">
              <label className="text-sm font-semibold text-slate-700">額外權限 (多選)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {extraPermsList.map((perm) => {
                  const isActive = formData.extraPermissions[perm.id as keyof typeof formData.extraPermissions];
                  return (
                    <button
                      key={perm.id}
                      type="button"
                      onClick={() => toggleExtraPermission(perm.id as keyof typeof formData.extraPermissions)}
                      className={`flex items-center p-3 rounded-xl border-2 transition-all text-left ${
                        isActive 
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                          : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg mr-2 ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        <perm.icon size={14} />
                      </div>
                      <span className="text-xs font-bold leading-tight">{perm.label}</span>
                      <div className="ml-auto">
                        {isActive ? <CheckSquare size={16} /> : <Square size={16} className="opacity-20" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Buttons (Full Width) */}
            <div className="md:col-span-2 flex items-center gap-4 mt-6">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 flex items-center justify-center py-3 px-4 border border-slate-300 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all active:scale-95 outline-none"
              >
                <ArrowLeft size={18} className="mr-2" /> 取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-[2] flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 outline-none ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? '提交中...' : (
                  <>
                    <CheckCircle size={18} className="mr-2" /> 完成註冊
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center">
            <Info size={12} className="mr-1.5" /> 註冊後需經由管理員審核方可啟用完整權限。
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
