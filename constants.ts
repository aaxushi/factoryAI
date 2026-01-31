
import { Thresholds } from './types';

export const GLOBAL_THRESHOLDS: Thresholds = {
  temperature: 80,
  vibration: 80,
  powerUsage: 80,
};

export const MACHINE_COUNT = 9;
export const UPDATE_INTERVAL_MS = 2000;
export const HISTORY_LIMIT = 20;
export const RECOVERY_DURATION_MS = 10000; // 10 seconds fix

export const INITIAL_VALUES = {
  temperature: 45,
  vibration: 30,
  powerUsage: 50,
};

export const ANOMALY_REASONS = [
  "Lubricant viscosity breakdown detected in primary bearing.",
  "Thermal gradient imbalance in secondary heat exchanger.",
  "Micro-fissure detected in hydraulic pressure assembly.",
  "Unsynchronized harmonic oscillation in rotary coupling.",
  "Power supply voltage fluctuation exceeding grid tolerances.",
  "Sensor calibration drift due to extreme environment flux.",
  "Magnetic interference affecting solenoid timing.",
  "Partial blockage in high-pressure coolant line."
];

export const CORRECTION_REASONS = [
  "Engaged emergency redundant cooling reservoir.",
  "Active harmonic dampening sequence successfully stabilized flux.",
  "Rerouted power through secondary capacitor banks.",
  "Automated nano-sealant injection completed for micro-fissure.",
  "Neural recalibration of timing sensors finalized.",
  "High-pressure bypass valve cleared blockage autonomously.",
  "Inertia dampeners activated to counter kinetic instability.",
  "Voltage regulation bypass engaged for grid stabilization."
];
