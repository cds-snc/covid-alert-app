import {NativeModules, Platform} from 'react-native';

const DebugMetricsBridge = NativeModules.DebugMetrics as {
  publishDebugMetric(stepNumber: number, message: string): Promise<void>;
};

export function publishDebugMetric(stepNumber: number, message = 'n/a') {
  if (Platform.OS === 'android') {
    DebugMetricsBridge.publishDebugMetric(stepNumber, message);
  }
}
