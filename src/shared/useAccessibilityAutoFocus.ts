import {useLayoutEffect, useState} from 'react';
import {useAccessibilityService} from 'services/AccessibilityService';

/**
 * Remember to add `accessible={true}` to target component
 * @returns [Manual focus ref , Auto focus ref]
 */
export const useAccessibilityAutoFocus = (isActive = true) => {
  const [autoFocusRef, setAutoFocusRef] = useState<any>();
  const accessibilityService = useAccessibilityService();

  useLayoutEffect(() => {
    if (!autoFocusRef || !isActive || !accessibilityService.isScreenReaderEnabled) {
      return;
    }

    accessibilityService.focusOnElement(autoFocusRef);
  }, [accessibilityService, autoFocusRef, isActive]);

  return [autoFocusRef, setAutoFocusRef];
};
