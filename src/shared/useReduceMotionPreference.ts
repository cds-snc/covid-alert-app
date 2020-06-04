import {useEffect, useState} from 'react';
import {AccessibilityInfo, AccessibilityEvent} from 'react-native';

export function useReduceMotionPreference() {
  const [prefersReducedMotion, setPreference] = useState(false);
  useEffect(() => {
    const handleChange = (isReduceMotionEnabled: AccessibilityEvent) => {
      setPreference(Boolean(isReduceMotionEnabled));
    };
    AccessibilityInfo.isReduceMotionEnabled()
      .then(handleChange)
      .catch(error => {
        console.warn('AccessibilityInfo.isReduceMotionEnabled promise failed', error);
      });
    AccessibilityInfo.addEventListener('reduceMotionChanged', handleChange);
    return () => {
      AccessibilityInfo.removeEventListener('reduceMotionChanged', handleChange);
    };
  }, []);
  return prefersReducedMotion;
}
