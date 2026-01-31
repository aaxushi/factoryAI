
export enum MachineStatus {
  NORMAL = 'NORMAL',
  CRITICAL = 'CRITICAL',
  OFFLINE = 'OFFLINE'
}

export enum AgentType {
  THERMAL = 'THERMAL',
  KINETIC = 'KINETIC',
  ENERGY = 'ENERGY'
}

export interface Agent {
  id: AgentType;
  name: string;
  isActive: boolean;
  description: string;
  load: number;
}

export interface SensorData {
  temperature: number;
  vibration: number;
  powerUsage: number;
  timestamp: number;
}

export interface Machine {
  id: string;
  name: string;
  factoryId: string;
  status: MachineStatus;
  currentData: SensorData;
  history: SensorData[];
  criticalAt?: number; // Timestamp of anomaly start
}

export interface Factory {
  id: string;
  name: string;
  location: string;
  machines: Machine[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  machineId: string;
  factoryId?: string;
  agentId?: AgentType;
  type: 'INFO' | 'WARNING' | 'ACTION' | 'RECOVERY';
  message: string;
  reasoning?: string; // Explainable AI property
  sensorValues?: {
    t: number;
    v: number;
    p: number;
  };
}

export interface Thresholds {
  temperature: number;
  vibration: number;
  powerUsage: number;
}
