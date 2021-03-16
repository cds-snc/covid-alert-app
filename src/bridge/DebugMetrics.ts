import {NativeModules, Platform} from 'react-native';

const DebugMetricsBridge = NativeModules.DebugMetrics as {
  publishDebugMetric(stepNumber: number): Promise<void>;
};

export function publishDebugMetric(stepNumber: number) {
  if (Platform.OS === 'android') {
    DebugMetricsBridge.publishDebugMetric(stepNumber);
  }
}
