import {NativeModules, Platform} from 'react-native';

const DebugMetricsBridge = NativeModules.DebugMetrics as {
  publishDebugMetric(stepNumber: number, message: string): Promise<void>;
  publishNativeActiveUserMetric(): Promise<void>;
};

export function publishDebugMetric(stepNumber: number, message = 'n/a') {
  DebugMetricsBridge.publishDebugMetric(stepNumber, message);
}

export function publishNativeActiveUserMetric() {
  if (Platform.OS === 'ios') {
    DebugMetricsBridge.publishNativeActiveUserMetric();
  }
}
