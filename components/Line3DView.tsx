
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Grid, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { 
  X, Thermometer, Activity, Clock, Cpu, Maximize2, Minimize2, 
  Fingerprint, ChevronRight, Calendar, Truck, Layers,
  Play, Square, User, Hash, CheckCircle2, ClipboardEdit, Save, AlertCircle,
  Scan, ShieldCheck, FileWarning
} from 'lucide-react';
import { Equipment, MachineStatus } from '../types';

// Predefined time slots for manual clock-in
const TIME_SLOTS = [
  '00:00~01:00', '01:00~02:00', '02:00~03:00', '03:00~04:00', '04:00~05:00', '05:00~06:00',
  '06:00~07:00', '07:00~08:00', '08:00~09:00', '09:00~10:00', '10:00~11:00', '11:00~12:00',
  '12:00~13:00', '13:00~14:00', '14:00~15:00', '15:00~16:00', '16:00~17:00', '17:00~18:00',
  '18:00~19:00', '19:00~20:00', '20:00~21:00', '21:00~22:00', '22:00~23:00', '23:00~24:00'
];

// --- 3D Components ---

interface ItemProps {
  data: Equipment;
  isSelected: boolean;
  onClick: (data: Equipment) => void;
  position: [number, number, number];
  isGlobalScanning?: boolean;
}

const MachineModel: React.FC<ItemProps> = ({ data, isSelected, onClick, position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && data.status === MachineStatus.Running) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(data); }}>
      <mesh 
        ref={meshRef} 
        position={[0, 1, 0]} 
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color={isSelected ? '#3b82f6' : hovered ? '#64748b' : '#334155'} 
          metalness={0.7} 
          roughness={0.2} 
        />
      </mesh>
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.7, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
      <Text position={[0, 2.5, 0]} fontSize={0.3} color="#1e293b" anchorX="center" anchorY="middle">
        {data.name}
      </Text>
    </group>
  );
};

const AGVModel: React.FC<ItemProps> = ({ data, isSelected, onClick, position }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current && data.status === MachineStatus.Running) {
      groupRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.4) * 2;
    }
  });

  return (
    <group ref={groupRef} position={position} onClick={(e) => { e.stopPropagation(); onClick(data); }}>
      <mesh position={[0, 0.3, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <boxGeometry args={[2.5, 0.6, 1.8]} />
        <meshStandardMaterial color={isSelected ? '#3b82f6' : hovered ? '#fbbf24' : '#f59e0b'} />
      </mesh>
      {[-0.8, 0.8].map((x, i) => [-0.6, 0.6].map((z, j) => (
        <mesh key={`${i}-${j}`} position={[x, 0.15, z]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      )))}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
        <meshBasicMaterial color={data.status === MachineStatus.Running ? '#ef4444' : '#4b5563'} />
      </mesh>
      {data.status === MachineStatus.Running && (
        <pointLight position={[0, 0.8, 0]} intensity={1} color="#ef4444" distance={3} />
      )}
      <Text position={[0, 1.2, 0]} fontSize={0.3} color="#451a03" anchorX="center">AGV: {data.name}</Text>
    </group>
  );
};

const FingerprintModel: React.FC<ItemProps> = ({ data, isSelected, onClick, position, isGlobalScanning }) => {
  const [hovered, setHovered] = useState(false);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current && isGlobalScanning) {
      lightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 10) * 1.0;
    }
  });
  
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(data); }}>
      <mesh position={[0, 0.7, 0]} onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}>
        <boxGeometry args={[0.6, 1.4, 0.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.45, 0.1]} rotation={[-Math.PI/4, 0, 0]}>
        <boxGeometry args={[0.8, 0.1, 0.6]} />
        <meshStandardMaterial color={isSelected ? '#3b82f6' : "#334155"} />
      </mesh>
      <mesh position={[0, 1.5, 0.2]} rotation={[-Math.PI/4, 0, 0]}>
        <planeGeometry args={[0.5, 0.3]} />
        <meshBasicMaterial color={isGlobalScanning ? "#3b82f6" : "#1e293b"} />
      </mesh>
      {isGlobalScanning && (
        <pointLight ref={lightRef} position={[0, 1.6, 0.3]} intensity={1.5} color="#3b82f6" distance={3} />
      )}
      <Text position={[0, 2, 0]} fontSize={0.2} color="black" anchorX="center">SCAN STATION</Text>
    </group>
  );
}

const FactoryScene: React.FC<{ 
  equipmentList: Equipment[],
  onItemClick: (data: Equipment) => void,
  selectedId: string | null,
  isScanning: boolean
}> = ({ equipmentList, onItemClick, selectedId, isScanning }) => {
  // Group equipment by production line ID for row-based layout
  const groupedEquipment = useMemo(() => {
    const groups: Record<string, Equipment[]> = {};
    equipmentList.forEach(item => {
      if (!groups[item.lineId]) {
        groups[item.lineId] = [];
      }
      groups[item.lineId].push(item);
    });
    return Object.entries(groups);
  }, [equipmentList]);

  const rowSpacing = 15;
  const columnSpacing = 8;

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      <Grid position={[0, 0, 0]} args={[100, 100]} cellColor="#cbd5e1" sectionColor="#94a3b8" fadeDistance={50} infiniteGrid />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {groupedEquipment.map(([lineId, items], rowIndex) => (
        <group key={lineId} position={[0, 0, rowIndex * -rowSpacing]}>
          {/* Row Label */}
          <Text 
            position={[-18, 0.5, 0]} 
            fontSize={1.2} 
            color="#3b82f6" 
            anchorX="right" 
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          >
            Line: {lineId}
          </Text>

          {/* Equipment in this Row */}
          {items.map((item, colIndex) => {
            const x = (colIndex * columnSpacing) - ((items.length - 1) * columnSpacing / 2);
            const position: [number, number, number] = [x, 0, 0];

            if (item.type === '打卡設備') {
              return <FingerprintModel key={item.id} data={item} isSelected={selectedId === item.id} onClick={onItemClick} position={position} isGlobalScanning={isScanning} />;
            }
            if (item.type === 'AGV小車') {
              return <AGVModel key={item.id} data={item} isSelected={selectedId === item.id} onClick={onItemClick} position={position} />;
            }
            return <MachineModel key={item.id} data={item} isSelected={selectedId === item.id} onClick={onItemClick} position={position} />;
          })}
        </group>
      ))}

      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
      <PerspectiveCamera makeDefault position={[0, 25, 40]} fov={45} />
      <Environment preset="city" />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={100} blur={2} far={4.5} />
    </>
  );
};

interface AttendanceLog {
  time: string;
  name: string;
  employeeId: string;
  isRetroactive?: boolean;
}

interface Line3DViewProps {
  equipmentList: Equipment[];
  onOpenAttendance: () => void;
  onOpenFACA: () => void;
}

const Line3DView: React.FC<Line3DViewProps> = ({ equipmentList, onOpenAttendance, onOpenFACA }) => {
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isRetroModalOpen, setIsRetroModalOpen] = useState(false);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);

  // Verification State for Retroactive Modal
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedInfo, setVerifiedInfo] = useState<{name: string, employeeId: string} | null>(null);
  const [verifyStatus, setVerifyStatus] = useState('請掃描指紋以確認身份');

  // Retroactive Form State (Refactored)
  const [retroForm, setRetroForm] = useState({
    date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    timeSlot: '08:00~09:00',
    reason: ''
  });

  // Simulate real-time data when scanning is active
  useEffect(() => {
    let interval: number;
    if (isScanning && selectedItem?.type === '打卡設備') {
      const names = ['王小明', '李大華', '張美玲', '趙鐵柱', '陳阿姨'];
      const ids = ['V001', 'V023', 'V045', 'V099', 'V102'];
      
      interval = window.setInterval(() => {
        const randomIndex = Math.floor(Math.random() * names.length);
        const newLog: AttendanceLog = {
          time: new Date().toLocaleTimeString(),
          name: names[randomIndex],
          employeeId: ids[randomIndex],
        };
        setAttendanceLogs(prev => [newLog, ...prev.slice(0, 19)]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isScanning, selectedItem]);

  const handleItemClick = (data: Equipment) => {
    setSelectedItem(data);
    if (data.type !== '打卡設備') {
      setIsScanning(false);
    }
  };

  const handleStartVerify = () => {
    setIsVerifying(true);
    setVerifyStatus('正在採集指紋，請稍候...');
    
    setTimeout(() => {
      setIsVerifying(false);
      const names = ['王小明', '李大華', '張美玲', '趙鐵柱', '陳阿姨'];
      const ids = ['V001', 'V023', 'V045', 'V099', 'V102'];
      const randomIndex = Math.floor(Math.random() * names.length);
      
      setVerifiedInfo({
        name: names[randomIndex],
        employeeId: ids[randomIndex]
      });
      setVerifyStatus('身份驗證成功');
    }, 1500);
  };

  const handleRetroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedInfo) {
      alert("請先完成身份驗證");
      return;
    }

    const newLog: AttendanceLog = {
      // Concatenate selected date and slot for display
      time: `${retroForm.date.slice(5)} ${retroForm.timeSlot.split('~')[0]}`, 
      name: verifiedInfo.name,
      employeeId: verifiedInfo.employeeId,
      isRetroactive: true
    };

    setAttendanceLogs(prev => [newLog, ...prev.slice(0, 19)]);
    setIsRetroModalOpen(false);
    setVerifiedInfo(null);
    setVerifyStatus('請掃描指紋以確認身份');
    setRetroForm({ 
      date: new Date().toISOString().slice(0, 10), 
      timeSlot: '08:00~09:00', 
      reason: '' 
    });
  };

  const getStatusColor = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.Running: return 'text-green-600 bg-green-100';
      case MachineStatus.Warning: return 'text-orange-600 bg-orange-100';
      case MachineStatus.Stopped: return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className={`bg-slate-900 border border-slate-700 relative flex transition-all duration-300 ${isMaximized ? 'fixed inset-0 z-50' : 'h-[calc(100vh-160px)] rounded-3xl overflow-hidden'}`}>
      <div className="flex-1 h-full w-full relative">
        {/* Main Header UI */}
        <div className="absolute top-6 left-6 z-10 space-y-3 pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Layers size={20} className="mr-2 text-blue-500" /> Factory Digital Twin - 3D Monitoring
            </h3>
            <p className="text-xs text-slate-400 mt-2">場景內實例：{equipmentList.length} 個單位</p>
            {isScanning && (
              <div className="mt-4 flex items-center text-blue-400 animate-pulse text-xs font-bold">
                <Activity size={12} className="mr-2" /> 指紋儀採集進行中...
              </div>
            )}
          </div>
          
          <button 
            onClick={onOpenFACA}
            className="pointer-events-auto flex items-center px-6 py-3 bg-red-600/90 backdrop-blur-md text-white rounded-xl font-bold text-xs shadow-xl shadow-red-900/20 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all group"
          >
            <div className="relative mr-2">
              <FileWarning size={16} />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
            </div>
            FACA 異常分析管理 <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="absolute top-6 right-6 z-10">
          <button 
            onClick={() => setIsMaximized(!isMaximized)} 
            className="p-3 bg-slate-800/80 backdrop-blur-md rounded-xl text-white hover:bg-slate-700 transition-all border border-slate-700 shadow-lg"
          >
            {isMaximized ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
          </button>
        </div>

        <div className="w-full h-full">
          <Canvas shadows dpr={[1, 2]}>
            <FactoryScene equipmentList={equipmentList} onItemClick={handleItemClick} selectedId={selectedItem?.id || null} isScanning={isScanning} />
          </Canvas>
        </div>
      </div>

      {/* Sidebar Detail */}
      <div className={`bg-white shadow-2xl z-20 transition-all duration-300 absolute right-0 top-0 bottom-0 overflow-hidden flex flex-col ${selectedItem ? 'w-80 translate-x-0' : 'w-80 translate-x-full opacity-0'}`}>
        {selectedItem && (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">單元屬性</h3>
              <button onClick={() => setSelectedItem(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl mb-3">
                  {selectedItem.type === '打卡設備' ? <Fingerprint size={32} /> : selectedItem.type === 'AGV小車' ? <Truck size={32} /> : <Cpu size={32} />}
                </div>
                <h4 className="text-md font-bold text-slate-900 text-center">{selectedItem.name}</h4>
                <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-tight">SN: {selectedItem.sn || selectedItem.id}</p>
                <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-2">Line: {selectedItem.lineId}</p>
              </div>

              {selectedItem.type === '打卡設備' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setIsScanning(true)}
                      disabled={isScanning}
                      className={`flex items-center justify-center py-3 rounded-xl text-xs font-bold transition-all shadow-sm
                        ${isScanning ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      <Play size={14} className="mr-1.5" /> 開始打卡
                    </button>
                    <button 
                      onClick={() => setIsScanning(false)}
                      disabled={!isScanning}
                      className={`flex items-center justify-center py-3 rounded-xl text-xs font-bold transition-all shadow-sm
                        ${!isScanning ? 'bg-slate-100 text-slate-400' : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'}`}
                    >
                      <Square size={14} className="mr-1.5" /> 停止打卡
                    </button>
                  </div>

                  <button 
                    onClick={() => setIsRetroModalOpen(true)}
                    className="w-full flex items-center justify-center py-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all shadow-sm"
                  >
                    <ClipboardEdit size={14} className="mr-1.5" /> 手動補卡
                  </button>

                  {/* Attendance Log List */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center">
                        <Activity size={12} className="mr-1.5" /> 實時考勤日誌
                      </span>
                      {isScanning && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {attendanceLogs.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <Clock size={24} className="mx-auto mb-2 opacity-20" />
                          <p className="text-[10px]">等待考勤數據...</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {attendanceLogs.map((log, idx) => (
                            <div key={idx} className={`p-3 transition-colors animate-in slide-in-from-top-1 ${log.isRetroactive ? 'bg-amber-50/30 border-l-2 border-amber-400' : 'hover:bg-blue-50'}`}>
                              <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold px-1.5 rounded ${log.isRetroactive ? 'text-amber-600 bg-amber-100' : 'text-blue-600 bg-blue-50'}`}>
                                  {log.time} {log.isRetroactive && '(補卡)'}
                                </span>
                                <CheckCircle2 size={12} className={log.isRetroactive ? 'text-amber-500' : 'text-green-500'} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 flex items-center">
                                  <User size={10} className="mr-1 text-slate-400" /> {log.name}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 flex items-center">
                                  <Hash size={10} className="mr-1" /> {log.employeeId}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={onOpenAttendance}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center group"
                  >
                    <Calendar size={14} className="mr-2" /> 查看完整報表 <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {selectedItem.type !== '打卡設備' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">運行狀態</p>
                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(selectedItem.status)}`}>
                      <Activity size={14} className="mr-2" /> {selectedItem.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center"><Thermometer size={12} className="mr-1" /> 溫度</p>
                      <p className="text-lg font-bold text-slate-800">{selectedItem.temperature}°C</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center"><Activity size={12} className="mr-1" /> 震動</p>
                      <p className="text-lg font-bold text-slate-800">{selectedItem.vibration}g</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Retroactive Modal (Refactored for split date/time) */}
      {isRetroModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
              <div className="flex items-center text-amber-800">
                <ClipboardEdit size={20} className="mr-2" />
                <h3 className="font-bold">員工考勤手動補卡</h3>
              </div>
              <button onClick={() => setIsRetroModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleRetroSubmit} className="p-6 space-y-6">
              <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 flex items-start">
                <AlertCircle size={16} className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-amber-700 leading-relaxed">提示：請員工先行掃描指紋驗證身份，補卡數據將標記為「手動錄入」。</p>
              </div>

              {/* Fingerprint Verification Module */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center">
                <div className={`w-20 h-20 bg-white rounded-2xl border-2 border-dashed flex items-center justify-center relative overflow-hidden mb-4 ${isVerifying ? 'border-blue-400' : verifiedInfo ? 'border-green-400 bg-green-50' : 'border-slate-300'}`}>
                   {verifiedInfo ? (
                     <ShieldCheck size={40} className="text-green-500 animate-in zoom-in" />
                   ) : (
                     <Fingerprint size={40} className={`text-slate-200 ${isVerifying ? 'animate-pulse text-blue-400' : ''}`} />
                   )}
                   {isVerifying && (
                     <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-full h-0.5 bg-blue-400 absolute animate-[bounce_2s_infinite]"></div>
                     </div>
                   )}
                </div>
                
                <div className="text-center space-y-2 mb-4">
                  <p className={`text-xs font-bold ${verifiedInfo ? 'text-green-600' : 'text-slate-500'}`}>{verifyStatus}</p>
                  {verifiedInfo && (
                    <div className="bg-white px-4 py-2 rounded-lg border border-green-100 shadow-sm animate-in slide-in-from-bottom-2">
                       <p className="text-sm font-bold text-slate-800">{verifiedInfo.name}</p>
                       <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">ID: {verifiedInfo.employeeId}</p>
                    </div>
                  )}
                </div>

                {!verifiedInfo ? (
                  <button
                    type="button"
                    onClick={handleStartVerify}
                    disabled={isVerifying}
                    className={`w-full flex items-center justify-center py-2.5 rounded-xl text-xs font-bold transition-all
                      ${isVerifying ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}`}
                  >
                    <Scan size={14} className="mr-2" /> 開始身份驗證
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setVerifiedInfo(null); setVerifyStatus('請掃描指紋以確認身份'); }}
                    className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                  >
                    重新驗證身份
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Refactored Date & Time Slot Section */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center">
                      <Calendar size={12} className="mr-1.5 text-blue-500" /> 補卡日期
                    </label>
                    <input
                      required
                      type="date"
                      value={retroForm.date}
                      onChange={(e) => setRetroForm({...retroForm, date: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center">
                      <Clock size={12} className="mr-1.5 text-blue-500" /> 補卡時間段
                    </label>
                    <select
                      required
                      value={retroForm.timeSlot}
                      onChange={(e) => setRetroForm({...retroForm, timeSlot: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
                    >
                      {TIME_SLOTS.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">補卡原因說明</label>
                  <textarea
                    value={retroForm.reason}
                    onChange={(e) => setRetroForm({...retroForm, reason: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                    placeholder="例如：漏帶卡、指紋儀感應失敗..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsRetroModalOpen(false)} 
                  className="flex-1 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-bold"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  disabled={!verifiedInfo}
                  className={`flex-[2] flex items-center justify-center px-4 py-2 rounded-xl font-bold shadow-lg transition-all active:scale-95
                    ${!verifiedInfo ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'}`}
                >
                  <Save size={16} className="mr-2" /> 提交補卡記錄
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Line3DView;
