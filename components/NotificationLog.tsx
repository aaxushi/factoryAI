
import React from 'react';
import { LogEntry } from '../types';
import { 
  Terminal, 
  Shield, 
  AlertTriangle, 
  Info, 
  MessageSquareQuote, 
  Factory as FactoryIcon, 
  Inbox, 
  Clock,
  Activity,
  Zap,
  Thermometer
} from 'lucide-react';

interface Props {
  logs: LogEntry[];
}

const NotificationLog: React.FC<Props> = ({ logs }) => {
  // Group logs by factoryId
  const groupedLogs = logs.reduce((acc, log) => {
    const key = log.factoryId || 'Global System';
    if (!acc[key]) acc[key] = [];
    acc[key].push(log);
    return acc;
  }, {} as Record<string, LogEntry[]>);

  // Get unique factory IDs and sort them
  const factoryIds = Object.keys(groupedLogs).sort((a, b) => {
    if (a === 'Global System') return 1; // Put global last
    return a.localeCompare(b);
  });

  // Extract last 5 anomalies across all factories
  const recentAnomalies = logs
    .filter(l => l.type === 'ACTION' || l.type === 'WARNING')
    .slice(0, 5);

  if (logs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20">
        <div className="bg-slate-800/20 border border-dashed border-slate-700 rounded-3xl p-20 text-center flex flex-col items-center">
          <div className="p-4 bg-slate-800/50 rounded-full mb-4">
            <Inbox className="text-slate-600" size={32} />
          </div>
          <h3 className="text-slate-400 font-bold text-lg">Event Stream Empty</h3>
          <p className="text-slate-500 text-sm max-w-xs mt-2">No operational data has been recorded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Factory Intelligence Center</h2>
          <p className="text-slate-500 text-sm mt-1">Categorized event logs by factory sector with cross-plant anomaly tracking.</p>
        </div>
        <div className="bg-slate-800 p-2.5 rounded-xl text-slate-400 border border-slate-700">
          <Terminal size={20} />
        </div>
      </div>

      {/* Factory-wise Log Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {factoryIds.map((fId) => (
          <div key={fId} className="flex flex-col h-[500px] bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Box Header */}
            <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FactoryIcon size={16} className="text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">
                  {fId === 'Global System' ? 'System Orchestrator' : `Sector ${fId}`}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                {groupedLogs[fId].length} Events
              </span>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {groupedLogs[fId].map((log) => (
                <div 
                  key={log.id} 
                  className={`p-3 rounded-xl border ${
                    log.type === 'ACTION' ? 'bg-rose-500/5 border-rose-500/20' : 
                    log.type === 'RECOVERY' ? 'bg-emerald-500/5 border-emerald-500/20' : 
                    'bg-slate-800/30 border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                      {log.machineId}
                    </span>
                    <span className="text-[9px] text-slate-500 flex items-center gap-1">
                      <Clock size={10} /> {log.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug mb-2">{log.message}</p>
                  
                  {log.sensorValues && (
                    <div className="flex gap-2 font-mono text-[9px] text-slate-500 border-t border-slate-700/50 pt-2">
                      <span className="flex items-center gap-1"><Thermometer size={10}/> {log.sensorValues.t}°</span>
                      <span className="flex items-center gap-1"><Activity size={10}/> {log.sensorValues.v}H</span>
                      <span className="flex items-center gap-1"><Zap size={10}/> {log.sensorValues.p}k</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary: Overall Last 5 Anomalies */}
      <div className="max-w-4xl mx-auto pt-10">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 bg-rose-500/10 border-b border-rose-500/20 flex items-center gap-3">
            <AlertTriangle size={18} className="text-rose-500" />
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-rose-500">Cross-Plant Anomaly Feed (Last 5)</h3>
            <div className="ml-auto w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          
          <div className="divide-y divide-slate-800">
            {recentAnomalies.length > 0 ? (
              recentAnomalies.map((anomaly) => (
                <div key={anomaly.id} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Sector: {anomaly.factoryId}</span>
                        <span className="text-xs font-bold text-slate-200">{anomaly.machineId}</span>
                        <span className="text-[10px] text-slate-500 font-mono">— {anomaly.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-400 font-medium">{anomaly.message}</p>
                    </div>
                  </div>
                  {anomaly.reasoning && (
                    <div className="hidden md:flex items-center gap-2 bg-indigo-500/5 px-3 py-1.5 rounded-lg border border-indigo-500/10 max-w-[300px]">
                      <MessageSquareQuote size={12} className="text-indigo-400/50 flex-shrink-0" />
                      <span className="text-[10px] italic text-indigo-300/60 truncate">{anomaly.reasoning}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-600 text-sm italic">No critical anomalies detected in the current session.</p>
              </div>
            )}
          </div>
          
          <div className="px-6 py-3 bg-slate-800/30 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">End of Unified Anomaly Sequence</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationLog;
