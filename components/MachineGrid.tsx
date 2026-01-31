
import React from 'react';
import { Machine, MachineStatus } from '../types';
import { Thermometer, Zap, Activity, AlertCircle, BrainCircuit, Power, RefreshCcw } from 'lucide-react';

interface Props {
  machines: Machine[];
  onSelect: (id: string) => void;
  onForceAnomaly: (id: string) => void;
  onPowerOff: (id: string) => void;
  onRestart: (id: string) => void;
}

const MachineGrid: React.FC<Props> = ({ machines, onSelect, onForceAnomaly, onPowerOff, onRestart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {machines.map((machine) => (
        <div 
          key={machine.id}
          className={`group bg-[#1e293b] border ${
            machine.status === MachineStatus.CRITICAL ? 'border-rose-500/50 shadow-lg shadow-rose-900/10' : 
            machine.status === MachineStatus.OFFLINE ? 'border-slate-800 opacity-60 grayscale-[0.5]' :
            'border-slate-800'
          } rounded-2xl p-5 hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden relative`}
          onClick={() => onSelect(machine.id)}
        >
          {/* Status Badge */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">{machine.id}</h3>
              <p className="text-xs text-slate-500 font-medium">{machine.name}</p>
            </div>
            <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
              machine.status === MachineStatus.CRITICAL ? 'bg-rose-500/20 text-rose-400' : 
              machine.status === MachineStatus.OFFLINE ? 'bg-slate-700/50 text-slate-500' :
              'bg-emerald-500/20 text-emerald-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                machine.status === MachineStatus.CRITICAL ? 'bg-rose-500 animate-pulse' : 
                machine.status === MachineStatus.OFFLINE ? 'bg-slate-500' :
                'bg-emerald-500'
              }`} />
              {machine.status}
            </div>
          </div>

          {/* Indicators */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-400">
                <Thermometer size={14} />
                <span className="text-xs font-medium">Temperature</span>
              </div>
              <span className={`text-sm font-bold mono ${machine.currentData.temperature > 80 ? 'text-rose-400' : 'text-slate-200'}`}>
                {machine.currentData.temperature}°C
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-400">
                <Activity size={14} />
                <span className="text-xs font-medium">Vibration</span>
              </div>
              <span className={`text-sm font-bold mono ${machine.currentData.vibration > 80 ? 'text-rose-400' : 'text-slate-200'}`}>
                {machine.currentData.vibration}Hz
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-400">
                <Zap size={14} />
                <span className="text-xs font-medium">Power</span>
              </div>
              <span className={`text-sm font-bold mono ${machine.currentData.powerUsage > 80 ? 'text-rose-400' : 'text-slate-200'}`}>
                {machine.currentData.powerUsage}kW
              </span>
            </div>
          </div>

          {/* Active Agent Indicator */}
          {machine.status === MachineStatus.CRITICAL && (
            <div className="mb-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 flex items-center gap-3">
              <BrainCircuit size={16} className="text-indigo-400 animate-pulse" />
              <div className="text-[10px] font-bold text-indigo-300 uppercase leading-tight">
                AI Stabilizing...
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onForceAnomaly(machine.id);
              }}
              disabled={machine.status === MachineStatus.CRITICAL || machine.status === MachineStatus.OFFLINE}
              className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                machine.status === MachineStatus.CRITICAL || machine.status === MachineStatus.OFFLINE
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-transparent' 
                  : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20'
              }`}
              title="Inject Anomaly"
            >
              <AlertCircle size={12} />
              Anomaly
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRestart(machine.id);
              }}
              className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-indigo-500/20 transition-all"
              title="Force Restart"
            >
              <RefreshCcw size={14} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPowerOff(machine.id);
              }}
              disabled={machine.status === MachineStatus.OFFLINE}
              className={`p-2 rounded-xl transition-all border ${
                machine.status === MachineStatus.OFFLINE 
                ? 'bg-slate-800 text-slate-600 border-transparent cursor-not-allowed' 
                : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border-rose-500/20'
              }`}
              title="Power Off"
            >
              <Power size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MachineGrid;
