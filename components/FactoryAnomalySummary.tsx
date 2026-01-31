
import React from 'react';
import { Machine, MachineStatus, LogEntry } from '../types';
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  factoryId: string;
  machines: Machine[];
  logs: LogEntry[];
}

const FactoryAnomalySummary: React.FC<Props> = ({ factoryId, machines, logs }) => {
  const criticalMachines = machines.filter(m => m.status === MachineStatus.CRITICAL);
  
  if (criticalMachines.length === 0) {
    return (
      <div className="mt-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-400">Zone Baseline Stable</h4>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">No active anomalies detected in {factoryId}</p>
          </div>
        </div>
        <div className="text-[10px] font-mono text-emerald-500/60 font-bold">ALL UNITS NOMINAL</div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-rose-500/5 border border-rose-500/20 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-rose-500/10 border-b border-rose-500/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertCircle size={16} />
          <h4 className="text-xs font-bold uppercase tracking-widest">Active Anomalies: {criticalMachines.length}</h4>
        </div>
        <span className="text-[10px] font-bold text-rose-500/60 px-2 py-0.5 bg-rose-500/10 rounded">PRIORITY ALPHA</span>
      </div>
      <div className="divide-y divide-rose-500/10">
        {criticalMachines.map(machine => {
          // Find the most recent action/warning log for this specific machine
          const latestLog = logs.find(l => l.machineId === machine.id && (l.type === 'ACTION' || l.type === 'WARNING'));
          
          return (
            <div key={machine.id} className="p-4 flex items-center justify-between hover:bg-rose-500/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-200">{machine.id}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Sensors: T{machine.currentData.temperature} V{machine.currentData.vibration}</span>
                </div>
                <ArrowRight size={14} className="text-slate-700" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-rose-300">
                    {latestLog ? latestLog.message : 'Stabilization in progress'}
                  </span>
                  {latestLog?.reasoning && (
                    <span className="text-[10px] text-slate-500 italic line-clamp-1 max-w-[300px]">
                      AI: {latestLog.reasoning}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-tighter">Intercepting</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FactoryAnomalySummary;
