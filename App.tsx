
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  Terminal, 
  Bell, 
  Cpu,
  BrainCircuit,
  Factory as FactoryIcon
} from 'lucide-react';
import { Machine, MachineStatus, LogEntry, SensorData, Agent, AgentType, Factory } from './types';
import { 
  UPDATE_INTERVAL_MS, 
  GLOBAL_THRESHOLDS, 
  INITIAL_VALUES, 
  HISTORY_LIMIT, 
  RECOVERY_DURATION_MS,
  ANOMALY_REASONS,
  CORRECTION_REASONS,
  MACHINE_COUNT
} from './constants';
import MachineGrid from './components/MachineGrid';
import MachineDetail from './components/MachineDetail';
import NotificationLog from './components/NotificationLog';
import AgentManager from './components/AgentManager';
import FactoryAnomalySummary from './components/FactoryAnomalySummary';

const INITIAL_AGENTS: Agent[] = [
  { 
    id: AgentType.THERMAL, 
    name: "Thermal Dynamics Agent", 
    isActive: true, 
    description: "Monitors thermal gradients. Uses explainable heat-map analysis to initiate liquid cooling bypasses.", 
    load: 12 
  },
  { 
    id: AgentType.KINETIC, 
    name: "Kinetic Stability Agent", 
    isActive: true, 
    description: "Detects vibration harmonics. Employs counter-vibration algorithms for mechanical stabilization.", 
    load: 8 
  },
  { 
    id: AgentType.ENERGY, 
    name: "Energy Efficiency Agent", 
    isActive: true, 
    description: "Optimizes power draw cycles. Throttles non-essential systems during peak demand anomalies.", 
    load: 5 
  }
];

const FACTORY_CONFIG = [
  { id: 'F1', name: 'Alpha Plant', location: 'Section A', count: 3 },
  { id: 'F2', name: 'Beta Works', location: 'Section B', count: 3 },
  { id: 'F3', name: 'Gamma Forge', location: 'Section C', count: 3 },
];

const App: React.FC = () => {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'agents'>('dashboard');

  const addLog = useCallback((
    machineId: string, 
    factoryId: string,
    type: LogEntry['type'], 
    message: string, 
    agentId?: AgentType, 
    reasoning?: string,
    data?: SensorData
  ) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      machineId,
      factoryId,
      agentId,
      type,
      message,
      reasoning,
      sensorValues: data ? { t: data.temperature, v: data.vibration, p: data.powerUsage } : undefined
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  }, []);

  // Initialize Factories with 3 machines each
  useEffect(() => {
    const initialFactories: Factory[] = FACTORY_CONFIG.map(f => ({
      ...f,
      machines: Array.from({ length: f.count }, (_, i) => ({
        id: `${f.id}-M${i + 1}`,
        name: `Unit ${i + 1}`,
        factoryId: f.id,
        status: MachineStatus.NORMAL,
        currentData: { ...INITIAL_VALUES, timestamp: Date.now() },
        history: []
      }))
    }));
    setFactories(initialFactories);
  }, []);

  // Agentic AI Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      setFactories(prevFactories => {
        return prevFactories.map(factory => {
          return {
            ...factory,
            machines: factory.machines.map(machine => {
              if (machine.status === MachineStatus.OFFLINE) {
                return {
                  ...machine,
                  currentData: { ...machine.currentData, timestamp: now },
                  history: [...machine.history, machine.currentData].slice(-HISTORY_LIMIT)
                };
              }

              let { temperature, vibration, powerUsage } = machine.currentData;
              let nextStatus = machine.status;
              let criticalAt = machine.criticalAt;
              const drift = () => (Math.random() - 0.5) * 3;

              // Check which agents are needed based on current breaches
              const needsThermal = temperature > GLOBAL_THRESHOLDS.temperature;
              const needsKinetic = vibration > GLOBAL_THRESHOLDS.vibration;
              const needsEnergy = powerUsage > GLOBAL_THRESHOLDS.powerUsage;

              const thermalAgent = agents.find(a => a.id === AgentType.THERMAL);
              const kineticAgent = agents.find(a => a.id === AgentType.KINETIC);
              const energyAgent = agents.find(a => a.id === AgentType.ENERGY);

              // RECOVERY LOGIC (10 SECOND FIX)
              if (machine.status === MachineStatus.CRITICAL && criticalAt) {
                const elapsed = now - criticalAt;
                
                // CRITICAL: Check if the required agents are active for recovery to proceed
                const recoveryBlocked = 
                  (needsThermal && !thermalAgent?.isActive) || 
                  (needsKinetic && !kineticAgent?.isActive) || 
                  (needsEnergy && !energyAgent?.isActive);

                if (!recoveryBlocked) {
                  // Gradually stabilize values only if agents are working
                  temperature = Math.max(45, temperature - 5);
                  vibration = Math.max(30, vibration - 4);
                  powerUsage = Math.max(50, powerUsage - 3);

                  if (elapsed >= RECOVERY_DURATION_MS) {
                    nextStatus = MachineStatus.NORMAL;
                    criticalAt = undefined;
                    const randomCorrection = CORRECTION_REASONS[Math.floor(Math.random() * CORRECTION_REASONS.length)];
                    addLog(
                      machine.id,
                      factory.id,
                      'RECOVERY', 
                      `Unit stabilized at ${factory.name}.`, 
                      undefined,
                      `AI Reasoning: ${randomCorrection}`
                    );
                  }
                } else {
                  // If recovery is blocked, values might even drift worse or stay high
                  temperature += Math.max(0, drift());
                  vibration += Math.max(0, drift());
                  powerUsage += Math.max(0, drift());
                  
                  // Reset criticalAt to extend recovery window if agent was off
                  // Or just keep the timer paused? Let's keep timer paused by not checking elapsed
                }
              } 
              // NORMAL MONITORING + RANDOM ANOMALY INJECTION
              else {
                temperature = Math.min(100, Math.max(20, temperature + drift()));
                vibration = Math.min(100, Math.max(10, vibration + drift()));
                powerUsage = Math.min(100, Math.max(10, powerUsage + drift()));

                // Random Anomaly Injection (approx 1.5% chance per cycle)
                const randomTrigger = Math.random() < 0.015;
                const thresholdBreach = temperature > GLOBAL_THRESHOLDS.temperature || 
                                      vibration > GLOBAL_THRESHOLDS.vibration || 
                                      powerUsage > GLOBAL_THRESHOLDS.powerUsage;

                if (randomTrigger || thresholdBreach) {
                  nextStatus = MachineStatus.CRITICAL;
                  criticalAt = now;
                  
                  // If it was a random trigger, spike the values
                  if (randomTrigger && !thresholdBreach) {
                    temperature = 85 + Math.random() * 10;
                    vibration = 82 + Math.random() * 8;
                  }

                  const randomReason = ANOMALY_REASONS[Math.floor(Math.random() * ANOMALY_REASONS.length)];
                  
                  // Determine primary agent responsible
                  let primaryAgent = AgentType.THERMAL;
                  if (vibration > GLOBAL_THRESHOLDS.vibration) primaryAgent = AgentType.KINETIC;
                  if (powerUsage > GLOBAL_THRESHOLDS.powerUsage) primaryAgent = AgentType.ENERGY;

                  addLog(
                    machine.id,
                    factory.id,
                    'ACTION', 
                    `Anomaly detected at ${factory.name}! Recovery requires active AI agents.`, 
                    primaryAgent,
                    `XAI Analysis: ${randomReason}`,
                    { temperature, vibration, powerUsage, timestamp: now }
                  );
                }
              }

              const newDataPoint: SensorData = {
                temperature: parseFloat(temperature.toFixed(2)),
                vibration: parseFloat(vibration.toFixed(2)),
                powerUsage: parseFloat(powerUsage.toFixed(2)),
                timestamp: now
              };

              return {
                ...machine,
                status: nextStatus,
                criticalAt,
                currentData: newDataPoint,
                history: [...machine.history, newDataPoint].slice(-HISTORY_LIMIT)
              };
            })
          };
        });
      });

      setAgents(prev => prev.map(a => ({
        ...a,
        load: a.isActive ? Math.floor(Math.random() * 20) + 5 : 0
      })));

    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [agents, addLog]);

  const toggleAgent = (id: AgentType) => {
    setAgents(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a);
      const agent = updated.find(a => a.id === id);
      addLog('SYSTEM', 'GLOBAL', 'INFO', `Agent Lifecycle Change: ${agent?.name} is now ${agent?.isActive ? 'ACTIVE' : 'OFFLINE'}. Recovery operations for related anomalies are ${agent?.isActive ? 'RESUMED' : 'SUSPENDED'}.`);
      return updated;
    });
  };

  const restartAgent = (id: AgentType) => {
    const agent = agents.find(a => a.id === id);
    addLog('SYSTEM', 'GLOBAL', 'INFO', `Performing hard restart on ${agent?.name}...`);
    setTimeout(() => {
      addLog('SYSTEM', 'GLOBAL', 'INFO', `${agent?.name} re-initialized with fresh neural weights.`);
    }, 1000);
  };

  const forceAnomaly = (id: string) => {
    setFactories(prev => prev.map(f => ({
      ...f,
      machines: f.machines.map(m => {
        if (m.id === id) {
          const anomalyData = { ...m.currentData, temperature: 95.0, vibration: 88.0 };
          const randomReason = ANOMALY_REASONS[Math.floor(Math.random() * ANOMALY_REASONS.length)];
          addLog(id, f.id, 'WARNING', 'Manual anomaly injection override.', undefined, `XAI Trace: ${randomReason}`);
          return { ...m, status: MachineStatus.CRITICAL, criticalAt: Date.now(), currentData: anomalyData };
        }
        return m;
      })
    })));
  };

  const powerOffMachine = (id: string) => {
    setFactories(prev => prev.map(f => ({
      ...f,
      machines: f.machines.map(m => {
        if (m.id === id) {
          addLog(id, f.id, 'INFO', 'Manual power-off command executed.', undefined, "XAI: Operator-initiated shutdown. Suspended all telemetry.");
          return { ...m, status: MachineStatus.OFFLINE, criticalAt: undefined };
        }
        return m;
      })
    })));
  };

  const restartMachine = (id: string) => {
    setFactories(prev => prev.map(f => ({
      ...f,
      machines: f.machines.map(m => {
        if (m.id === id) {
          const resetData = { ...INITIAL_VALUES, timestamp: Date.now() };
          addLog(id, f.id, 'RECOVERY', 'Hard reset initiated.', undefined, "XAI: Resetting hardware buffers and recalibrating sensor baseline.");
          return { 
            ...m, 
            status: MachineStatus.NORMAL, 
            criticalAt: undefined,
            currentData: resetData,
            history: [...m.history, resetData].slice(-HISTORY_LIMIT)
          };
        }
        return m;
      })
    })));
  };

  const allMachines = factories.flatMap(f => f.machines);
  const selectedMachine = allMachines.find(m => m.id === selectedMachineId);

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden">
      <aside className="w-64 bg-[#1e293b] border-r border-slate-700 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">FactoryAI</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('agents')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'agents' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <BrainCircuit size={20} />
            <span className="font-medium">AI Agents</span>
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'logs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Terminal size={20} />
            <span className="font-medium">Global Logs</span>
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-700">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fabric Online</span>
            </div>
            <div className="text-sm font-medium text-slate-200">{MACHINE_COUNT} Units Managed</div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">
              {activeTab === 'dashboard' ? 'Enterprise Dashboard' : activeTab === 'agents' ? 'Agent Orchestrator' : 'Event Stream'}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              {factories.map(f => {
                const isCritical = f.machines.some(m => m.status === MachineStatus.CRITICAL);
                return (
                  <div key={f.id} className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isCritical ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                    {f.id}
                  </div>
                );
              })}
            </div>
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              {logs.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full border border-[#0f172a]" />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'dashboard' && (
            <div className="space-y-12">
              {factories.map(factory => (
                <div key={factory.id} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <FactoryIcon size={20} className="text-indigo-400" />
                    <h2 className="text-xl font-bold text-white">{factory.name}</h2>
                    <span className="text-slate-500 text-xs font-medium uppercase tracking-widest">— {factory.location} ({factory.machines.length} Units)</span>
                  </div>
                  <MachineGrid 
                    machines={factory.machines} 
                    onSelect={setSelectedMachineId} 
                    onForceAnomaly={forceAnomaly} 
                    onPowerOff={powerOffMachine}
                    onRestart={restartMachine}
                  />
                  <FactoryAnomalySummary 
                    factoryId={factory.id} 
                    machines={factory.machines} 
                    logs={logs.filter(l => l.factoryId === factory.id)} 
                  />
                </div>
              ))}
            </div>
          )}
          {activeTab === 'agents' && (
            <AgentManager 
              agents={agents} 
              onToggleAgent={toggleAgent} 
              onRestartAgent={restartAgent} 
            />
          )}
          {activeTab === 'logs' && (
            <NotificationLog logs={logs} />
          )}
        </div>

        {selectedMachine && (
          <MachineDetail 
            machine={selectedMachine} 
            logs={logs.filter(l => l.machineId === selectedMachine.id)}
            onClose={() => setSelectedMachineId(null)} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
