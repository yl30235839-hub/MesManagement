import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Text, Grid, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import api from '../services/api';
import { 
  X, Activity, Cpu, Maximize2, Minimize2, 
  Fingerprint, ChevronRight, Truck, Layers,
  Play, Square, MapPin, Hash, Save, RotateCw, FileWarning
} from 'lucide-react';
import { Equipment, MachineStatus } from '../types';

// Fix: Extend the JSX namespace to include Three.js intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// --- 3D Components ---

interface ItemProps {
  data: Equipment;
  isSelected: boolean;
  onClick: (data: Equipment) => void;
  position: [number, number, number];
  isGlobalScanning?: boolean;
}

/**
 * MachineModel: Manually drawn as a Cube (BoxGeometry)
 */
const MachineModel: React.FC<ItemProps> = ({ data, isSelected, onClick, position }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group 
      position={position} 
      onClick={(e: any) => { e.stopPropagation(); onClick(data); }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial 
          color={isSelected ? '#3b82f6' : hovered ? '#475569' : '#1e293b'} 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[3.2, 0.1, 3.2]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      
      {isSelected && (
        <mesh position={[0, -1.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.7, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
        <meshBasicMaterial color={data.status === MachineStatus.Running ? '#22c55e' : data.status === MachineStatus.Warning ? '#eab308' : '#ef4444'} />
      </mesh>
      
      <Text position={[0, 4, 0]} fontSize={0.35} color="#1e293b" anchorX="center" anchorY="middle">
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
    <group ref={groupRef} position={position} onClick={(e: any) => { e.stopPropagation(); onClick(data); }}>
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
      <Text position={[0, 1.5, 0]} fontSize={0.3} color="#451a03" anchorX="center">AGV: {data.name}</Text>
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
    <group position={position} onClick={(e: any) => { e.stopPropagation(); onClick(data); }}>
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
      <Text position={[0, 2.2, 0]} fontSize={0.2} color="#111" anchorX="center">SCAN STATION</Text>
    </group>
  );
}

const FactoryScene: React.FC<{ 
  equipmentList: Equipment[],
  onItemClick: (data: Equipment) => void,
  selectedId: string | null,
  isScanning: boolean
}> = ({ equipmentList, onItemClick, selectedId, isScanning }) => {
  const groupedEquipment = useMemo(() => {
    const groups: Record<string, Equipment[]> = {};
    if (!equipmentList) return [];
    equipmentList.forEach(item => {
      if (!groups[item.lineId]) {
        groups[item.lineId] = [];
      }
      groups[item.lineId].push(item);
    });
    return Object.entries(groups);
  }, [equipmentList]);

  const rowSpacing = 20;
  const columnSpacing = 15;

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[20, 30, 10]} intensity={1} castShadow />
      <directionalLight position={[-10, 20, 10]} intensity={1.5} castShadow />
      
      <Grid 
        position={[0, -0.01, 0]} 
        args={[100, 100]} 
        cellColor="#cbd5e1" 
        sectionColor="#94a3b8" 
        fadeDistance={50} 
        infiniteGrid 
      />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {groupedEquipment.map(([lineId, items], rowIndex) => (
        <group key={lineId} position={[0, 0, rowIndex * -rowSpacing]}>
          <Text 
            position={[-35, 0.5, 0]} 
            fontSize={2} 
            color="#3b82f6" 
            anchorX="right" 
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          >
            Line: {lineId}
          </Text>

          {items.map((item, colIndex) => {
            const x = (colIndex * columnSpacing) - ((items.length - 1) * columnSpacing / 2);
            
            if (item.type === '打卡設備') {
              return <FingerprintModel key={item.id} data={item} isSelected={selectedId === item.id} onClick={onItemClick} position={[x, 0, 0]} isGlobalScanning={isScanning} />;
            }
            if (item.type === 'AGV小車') {
              return <AGVModel key={item.id} data={item} isSelected={selectedId === item.id} onClick={onItemClick} position={[x, 0, 0]} />;
            }
            // Assembly machine base elevated
            return <MachineModel key={item.id} data={item} isSelected={selectedId === item.id} onClick={onItemClick} position={[x, 1.5, 0]} />;
          })}
        </group>
      ))}

      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
      <PerspectiveCamera makeDefault position={[0, 40, 60]} fov={45} />
      <Environment preset="city" />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={100} blur={2} far={4.5} />
    </>
  );
};

interface Line3DViewProps {
  equipmentList: Equipment[];
  onOpenAttendance: () => void;
  onOpenFACA: () => void;
}

const Line3DView: React.FC<Line3DViewProps> = ({ equipmentList, onOpenAttendance, onOpenFACA }) => {
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleItemClick = (data: Equipment) => {
    setSelectedItem(data);
    if (data.type !== '打卡設備') {
      setIsScanning(false);
    }
  };

  const handleStartClockIn = async () => {
    if (!selectedItem || selectedItem.type !== '打卡設備') return;
    const fingerNo = parseInt(selectedItem.fingerprintId || '1', 10);
    
    try {
      const response = await api.post('/RegistPage/Verify', { fingerNo });
      if (response.data.code === 200) {
        setIsScanning(true);
      } else {
        alert(`啟動打卡失敗: ${response.data.message}`);
      }
    } catch (error: any) {
      setIsScanning(true);
    }
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
    <div className={`bg-slate-900 relative flex transition-all duration-300 flex-1 ${isMaximized ? 'fixed inset-0 z-50' : 'h-full w-full'}`}>
      <div className="flex-1 h-full w-full relative overflow-hidden">
        {/* UI Overlay */}
        <div className="absolute top-6 left-6 z-10 space-y-3 pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Layers size={20} className="mr-2 text-blue-500" /> Factory Digital Twin - 3D Monitoring
            </h3>
            <p className="text-xs text-slate-400 mt-2">場景內實例：{equipmentList?.length || 0} 個單位</p>
          </div>
          
          <button 
            onClick={onOpenFACA}
            className="pointer-events-auto flex items-center px-6 py-3 bg-red-600/90 backdrop-blur-md text-white rounded-xl font-bold text-xs shadow-xl hover:bg-red-700 transition-all group"
          >
            <FileWarning size={16} className="mr-2" /> FACA 異常分析管理 <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
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

        {/* 3D Canvas - Ensuring 100% size */}
        <div className="w-full h-full min-h-[500px]">
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 40, 60], fov: 45 }}>
            <FactoryScene equipmentList={equipmentList} onItemClick={handleItemClick} selectedId={selectedItem?.id || null} isScanning={isScanning} />
          </Canvas>
        </div>
      </div>

      {/* Property Sidebar */}
      <div className={`bg-white shadow-2xl z-20 transition-all duration-300 absolute right-0 top-0 bottom-0 overflow-hidden flex flex-col ${selectedItem ? 'w-80 translate-x-0' : 'w-80 translate-x-full opacity-0 pointer-events-none'}`}>
        {selectedItem && (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">單元屬性</h3>
              <button onClick={() => setSelectedItem(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl mb-3">
                  {selectedItem.type === '打卡設備' ? <Fingerprint size={32} /> : selectedItem.type === 'AGV小車' ? <Truck size={32} /> : <Cpu size={32} />}
                </div>
                <h4 className="text-md font-bold text-slate-900 text-center">{selectedItem.name}</h4>
                <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-tight">SN: {selectedItem.sn || selectedItem.id}</p>
                <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-2">Line: {selectedItem.lineId}</p>
              </div>

              {selectedItem.type === '打卡設備' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleStartClockIn} disabled={isScanning} className="flex items-center justify-center py-3 rounded-xl text-xs font-bold transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400">
                      <Play size={14} className="mr-1.5" /> 開始打卡
                    </button>
                    <button onClick={() => setIsScanning(false)} disabled={!isScanning} className="flex items-center justify-center py-3 rounded-xl text-xs font-bold transition-all border border-red-100 text-red-600 hover:bg-red-50 disabled:bg-slate-100 disabled:text-slate-400">
                      <Square size={14} className="mr-1.5" /> 停止打卡
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">運行狀態</p>
                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(selectedItem.status)}`}>
                      <Activity size={14} className="mr-2" /> {selectedItem.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">溫度</p>
                      <p className="text-sm font-bold text-slate-800">{selectedItem.temperature}°C</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">震動</p>
                      <p className="text-sm font-bold text-slate-800">{selectedItem.vibration} mm/s</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Line3DView;