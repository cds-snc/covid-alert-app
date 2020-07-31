import {useEffect, useState} from 'react';
import {AccessibilityInfo, AccessibilityEvent} from 'react-native';

import {captureException} from './log';

export function useReduceMotionPreference() {
  const [prefersReducedMotion, setPreference] = useState(false);
  useEffect(() => {
    const handleChange = (isReduceMotionEnabled: AccessibilityEvent) => {
      setPreference(Boolean(isReduceMotionEnabled));
    };
    AccessibilityInfo.isReduceMotionEnabled()
      .then(handleChange)
      .catch(error => {
        captureException('AccessibilityInfo.isReduceMotionEnabled promise failed', error);
      });
    AccessibilityInfo.addEventListener('reduceMotionChanged', handleChange);
    return () => {
      AccessibilityInfo.removeEventListener('reduceMotionChanged', handleChange);
    };
  }, []);
  return prefersReducedMotion;
}
