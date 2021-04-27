import {NativeModules} from 'react-native';

const DebugMetricsBridge = NativeModules.DebugMetrics as {
  publishDebugMetric(stepNumber: number, message: string): Promise<void>;
};

export function publishDebugMetric(stepNumber: number, message = 'n/a') {
  DebugMetricsBridge.publishDebugMetric(stepNumber, message);
}
