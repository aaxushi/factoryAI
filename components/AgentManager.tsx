
import React from 'react';
import { Agent, AgentType } from '../types';
import { Power, RefreshCcw, ShieldCheck, Activity, Thermometer, Zap, Settings2 } from 'lucide-react';

interface Props {
  agents: Agent[];
  onToggleAgent: (id: AgentType) => void;
  onRestartAgent: (id: AgentType) => void;
}

const AgentManager: React.FC<Props> = ({ agents, onToggleAgent, onRestartAgent }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Agentic Fabric Orchestration</h2>
          <p className="text-slate-400 text-sm">Lifecycle management for specialized autonomous units.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-all">
            <Settings2 size={16} />
            Global Config
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className={`bg-[#1e293b] border ${agent.isActive ? 'border-indigo-500/30' : 'border-slate-800 opacity-75'} rounded-2xl p-6 relative overflow-hidden transition-all`}>
            {!agent.isActive && (
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <span className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">Offline</span>
              </div>
            )}
            
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-xl ${
                agent.id === AgentType.THERMAL ? 'bg-orange-500/10 text-orange-400' :
                agent.id === AgentType.KINETIC ? 'bg-emerald-500/10 text-emerald-400' :
                'bg-blue-500/10 text-blue-400'
              }`}>
                {agent.id === AgentType.THERMAL && <Thermometer size={24} />}
                {agent.id === AgentType.KINETIC && <Activity size={24} />}
                {agent.id === AgentType.ENERGY && <Zap size={24} />}
              </div>
              <div className="flex gap-2 relative z-20">
                <button 
                  onClick={() => onRestartAgent(agent.id)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors"
                >
                  <RefreshCcw size={16} />
                </button>
                <button 
                  onClick={() => onToggleAgent(agent.id)}
                  className={`p-2 rounded-lg transition-colors ${agent.isActive ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                >
                  <Power size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">{agent.name}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 h-12 overflow-hidden">{agent.description}</p>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
                <span>Processor Load</span>
                <span>{agent.load}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    agent.id === AgentType.THERMAL ? 'bg-orange-500' :
                    agent.id === AgentType.KINETIC ? 'bg-emerald-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${agent.load}%` }}
                />
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className={agent.isActive ? 'text-emerald-400' : 'text-slate-600'} />
                <span className={`text-[10px] font-bold uppercase ${agent.isActive ? 'text-slate-300' : 'text-slate-600'}`}>Status: {agent.isActive ? 'Active' : 'Standby'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentManager;
