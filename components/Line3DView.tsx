import React, { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Text, Grid, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { X, Thermometer, Activity, Clock, Cpu, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

// --- Data Types & Mock Data ---

interface MachineData {
  id: string;
  name: string;
  status: 'RUNNING' | 'WARNING' | 'STOPPED';
  temp: number;
  vibration: number;
  uptime: string;
  maintenanceDate: string;
  position: [number, number, number];
  color: string;
}

const MACHINES: MachineData[] = [
  { 
    id: 'M-101', 
    name: 'CNC Milling Unit A', 
    status: 'RUNNING', 
    temp: 62.5, 
    vibration: 0.45, 
    uptime: '12h 30m', 
    maintenanceDate: '2024-03-10',
    position: [-4, 0, -1.5], 
    color: '#475569' 
  },
  { 
    id: 'M-102', 
    name: 'Robotic Arm Beta', 
    status: 'WARNING', 
    temp: 78.2, 
    vibration: 2.1, 
    uptime: '4h 15m', 
    maintenanceDate: '2024-02-28',
    position: [0, 0, 1.5], 
    color: '#334155' 
  },
  { 
    id: 'M-103', 
    name: 'Quality Scanner Gen2', 
    status: 'RUNNING', 
    temp: 45.0, 
    vibration: 0.12, 
    uptime: '24h 00m', 
    maintenanceDate: '2024-03-15',
    position: [4, 0, -1.5], 
    color: '#475569' 
  },
];

// --- 3D Components ---

interface MachineProps {
  data: MachineData;
  isSelected: boolean;
  onClick: (data: MachineData) => void;
}

const Machine: React.FC<MachineProps> = ({ data, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && data.status === 'RUNNING') {
      // Subtle vibration effect when running
      meshRef.current.position.y = data.position[1] + Math.sin(state.clock.elapsedTime * 10) * 0.005;
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={data.position} onClick={(e) => { e.stopPropagation(); onClick(data); }}>
      <mesh 
        ref={meshRef} 
        position={[0, 0.75, 0]} 
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          color={isSelected ? '#3b82f6' : hovered ? '#64748b' : data.color} 
          emissive={isSelected ? '#1e40af' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
          metalness={0.6} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Selection Ring */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshBasicMaterial color="#3b82f6" opacity={0.8} transparent side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Status Light */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={data.status === 'RUNNING' ? '#4ade80' : data.status === 'WARNING' ? '#fbbf24' : '#ef4444'} />
      </mesh>
      
      {/* Machine Label */}
      <Text position={[0, 2, 0]} fontSize={0.2} color="black" anchorX="center" anchorY="middle">
        {data.status}
      </Text>
    </group>
  );
};

const ConveyorBelt: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
      <planeGeometry args={[20, 2]} />
      <meshStandardMaterial color="#334155" roughness={0.8} />
    </mesh>
  );
};

const Product: React.FC<{ offset: number, speed: number }> = ({ offset, speed }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      // Move product along X axis
      const t = (state.clock.elapsedTime * speed + offset) % 10; 
      ref.current.position.x = -5 + t; // Move from -5 to 5
      // Reset logic visually handled by modulo
      if (ref.current.position.x > 5) ref.current.position.x = -5;
    }
  });

  return (
    <mesh ref={ref} position={[-5, 0.3, 0]}>
      <boxGeometry args={[0.4, 0.2, 0.4]} />
      <meshStandardMaterial color="#60a5fa" />
    </mesh>
  );
};

const FactoryScene: React.FC<{ 
  onMachineClick: (data: MachineData) => void,
  selectedId: string | null 
}> = ({ onMachineClick, selectedId }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />
      
      <Grid position={[0, 0, 0]} args={[20, 20]} cellColor="#cbd5e1" sectionColor="#94a3b8" fadeDistance={20} />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} onClick={(e) => {
        // Optional: Deselect when clicking floor
        // onMachineClick(null as any); 
      }}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#f1f5f9" />
      </mesh>

      <ConveyorBelt />

      {/* Machines along the belt */}
      {MACHINES.map((machine) => (
        <Machine 
          key={machine.id} 
          data={machine} 
          isSelected={selectedId === machine.id}
          onClick={onMachineClick} 
        />
      ))}

      {/* Moving Products */}
      <Product offset={0} speed={1.5} />
      <Product offset={2.5} speed={1.5} />
      <Product offset={5} speed={1.5} />
      <Product offset={7.5} speed={1.5} />

      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
      <PerspectiveCamera makeDefault position={[0, 8, 12]} fov={50} />
    </>
  );
};

const Line3DView: React.FC = () => {
  const [selectedMachine, setSelectedMachine] = useState<MachineData | null>(null);

  const handleMachineClick = (data: MachineData) => {
    setSelectedMachine(data);
  };

  const handleClosePanel = () => {
    setSelectedMachine(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING': return 'text-green-600 bg-green-100';
      case 'WARNING': return 'text-orange-600 bg-orange-100';
      case 'STOPPED': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RUNNING': return <CheckCircle size={16} className="mr-1.5" />;
      case 'WARNING': return <AlertTriangle size={16} className="mr-1.5" />;
      case 'STOPPED': return <AlertCircle size={16} className="mr-1.5" />;
      default: return <Activity size={16} className="mr-1.5" />;
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] bg-slate-100 rounded-xl overflow-hidden border border-slate-300 relative shadow-inner flex">
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg pointer-events-none">
          <h3 className="font-bold text-slate-800">Assembly Line A - Live Digital Twin</h3>
          <div className="mt-2 space-y-1 text-sm text-slate-600">
             <p className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> System Online</p>
             <p className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span> 450 Units/Hr</p>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 z-10 bg-slate-900/80 text-white text-xs px-3 py-1 rounded backdrop-blur pointer-events-none">
          Interact: Left Click to Select • Right Click to Pan • Scroll to Zoom
        </div>

        <Canvas shadows>
          <FactoryScene 
            onMachineClick={handleMachineClick} 
            selectedId={selectedMachine?.id || null}
          />
        </Canvas>
      </div>

      {/* Right Side Details Panel */}
      <div 
        className={`bg-white border-l border-slate-200 shadow-xl z-20 transition-all duration-300 ease-in-out absolute right-0 top-0 bottom-0 overflow-y-auto
        ${selectedMachine ? 'w-80 translate-x-0' : 'w-80 translate-x-full opacity-0 pointer-events-none'}`}
      >
        {selectedMachine && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-slate-800">設備詳情</h3>
              <button 
                onClick={handleClosePanel}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <div className="w-full h-32 bg-slate-100 rounded-lg mb-4 flex items-center justify-center text-slate-400">
                <Cpu size={48} opacity={0.2} />
              </div>
              <h4 className="text-lg font-bold text-slate-900">{selectedMachine.name}</h4>
              <p className="text-sm font-mono text-slate-400 mt-1">ID: {selectedMachine.id}</p>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-2 uppercase font-semibold tracking-wider">Status</p>
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${getStatusColor(selectedMachine.status)}`}>
                  {getStatusIcon(selectedMachine.status)}
                  {selectedMachine.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1 flex items-center"><Thermometer size={12} className="mr-1" /> Temp</p>
                  <p className="text-lg font-bold text-slate-800">{selectedMachine.temp}°C</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <p className="text-xs text-slate-500 mb-1 flex items-center"><Activity size={12} className="mr-1" /> Vib</p>
                   <p className="text-lg font-bold text-slate-800">{selectedMachine.vibration}mm</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <p className="text-xs text-slate-500 mb-1 flex items-center"><Clock size={12} className="mr-1" /> Uptime</p>
                 <p className="text-sm font-medium text-slate-800">{selectedMachine.uptime} since last restart</p>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-4">
                 <p className="text-xs text-slate-400 mb-2">Last Maintenance</p>
                 <p className="text-sm font-medium text-slate-700">{selectedMachine.maintenanceDate}</p>
              </div>

              <div className="pt-4">
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  View Full Logs
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Line3DView;