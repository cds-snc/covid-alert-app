import {useLayoutEffect, useState} from 'react';
import {AccessibilityInfo, findNodeHandle} from 'react-native';

/**
 * Remember to add `accessible={true}` to target component
 */
export const useAccessibilityAutoFocus = (isActive = true) => {
  const [autoFocusRef, setAutoFocusRef] = useState<any>();

  useLayoutEffect(() => {
    const node = findNodeHandle(autoFocusRef);
    if (!node || !isActive) {
      return;
    }
    AccessibilityInfo.setAccessibilityFocus(node);
  }, [autoFocusRef, isActive]);

  return setAutoFocusRef;
};
