
import React from 'react';
import { 
  X, 
  Thermometer, 
  Activity, 
  Zap, 
  History, 
  ShieldCheck, 
  ArrowDownCircle, 
  AlertTriangle 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Machine, LogEntry, MachineStatus } from '../types';
import { GLOBAL_THRESHOLDS } from '../constants';

interface Props {
  machine: Machine;
  logs: LogEntry[];
  onClose: () => void;
}

const MachineDetail: React.FC<Props> = ({ machine, logs, onClose }) => {
  // Format history for charts
  const chartData = machine.history.map((h, i) => ({
    time: i,
    temp: h.temperature,
    vib: h.vibration,
    power: h.powerUsage
  }));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="relative w-full max-w-2xl bg-[#1e293b] h-full shadow-2xl flex flex-col border-l border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${machine.status === MachineStatus.CRITICAL ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
              <Activity size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{machine.id}: {machine.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${machine.status === MachineStatus.CRITICAL ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {machine.status} State
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-slate-500 text-xs">AI Monitoring Active</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Status Metrics Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Thermometer size={14} />
                <span className="text-xs font-semibold uppercase tracking-tight">Temp</span>
              </div>
              <div className="text-2xl font-bold mono text-white">{machine.currentData.temperature}°C</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase">Max: {GLOBAL_THRESHOLDS.temperature}°C</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Activity size={14} />
                <span className="text-xs font-semibold uppercase tracking-tight">Vib</span>
              </div>
              <div className="text-2xl font-bold mono text-white">{machine.currentData.vibration}Hz</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase">Max: {GLOBAL_THRESHOLDS.vibration}Hz</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Zap size={14} />
                <span className="text-xs font-semibold uppercase tracking-tight">Power</span>
              </div>
              <div className="text-2xl font-bold mono text-white">{machine.currentData.powerUsage}kW</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase">Max: {GLOBAL_THRESHOLDS.powerUsage}kW</div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="space-y-6">
            <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Live Health Analytics</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold">
                  <span className="flex items-center gap-1.5 text-indigo-400 uppercase"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Temp</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 uppercase"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Vibration</span>
                  <span className="flex items-center gap-1.5 text-amber-400 uppercase"><div className="w-2 h-2 rounded-full bg-amber-500" /> Power</span>
                </div>
              </div>
              
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis hide dataKey="time" />
                    <YAxis domain={[0, 110]} hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <ReferenceLine y={80} stroke="#f43f5e" strokeDasharray="5 5" label={{ value: 'Limit', fill: '#f43f5e', fontSize: 10, position: 'insideRight' }} />
                    <Line type="monotone" dataKey="temp" stroke="#6366f1" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="vib" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="power" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recovery Log / Logic Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <History size={16} />
              <h3 className="text-xs font-bold uppercase tracking-widest">Autonomous Action Trace</h3>
            </div>
            
            <div className="space-y-3">
              {logs.length === 0 ? (
                <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-8 text-center">
                  <p className="text-slate-500 text-sm">No critical incidents recorded for this unit.</p>
                </div>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex gap-4">
                    <div className="mt-1">
                      {log.type === 'ACTION' && <AlertTriangle className="text-rose-400" size={18} />}
                      {log.type === 'RECOVERY' && <ShieldCheck className="text-emerald-400" size={18} />}
                      {log.type === 'WARNING' && <ArrowDownCircle className="text-amber-400" size={18} />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-300 mb-1 uppercase tracking-tight">{log.type} Event • {log.timestamp}</div>
                      <p className="text-sm text-slate-400 leading-relaxed">{log.message}</p>
                      {log.sensorValues && (
                        <div className="flex gap-4 mt-2 font-mono text-[10px] text-indigo-400">
                          <span>T: {log.sensorValues.t}°</span>
                          <span>V: {log.sensorValues.v}Hz</span>
                          <span>P: {log.sensorValues.p}kW</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-6 border-t border-slate-700 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="text-xs text-slate-500">
               <span className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Global Configuration</span>
               Threshold: T80 / V80 / P80
             </div>
          </div>
          <div className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-bold">
            UNIT-CERTIFIED-READY
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDetail;
