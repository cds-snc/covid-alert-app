import {useLayoutEffect, useState, useCallback} from 'react';
import {AccessibilityInfo, findNodeHandle} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useAccessibilityService} from 'services/AccessibilityService';

/**
 * Look like there is timing issue with AccessibilityInfo.setAccessibilityFocus
 * Ref https://github.com/react-native-community/discussions-and-proposals/issues/118
 */
const AUTO_FOCUS_DELAY = 500;

const focusOnElement = (elementRef: any) => {
  const node = findNodeHandle(elementRef);
  if (!node) {
    return;
  }
  AccessibilityInfo.setAccessibilityFocus(node);
};

/**
 * Remember to add `accessible={true}` to target component
 * @returns [Manual focus ref , Auto focus ref]
 */
export const useAccessibilityAutoFocus = (isActive = true) => {
  const [autoFocusRef, setAutoFocusRef] = useState<any>();

  const {isScreenReaderEnabled} = useAccessibilityService();
  const [isFocus, setIsFocus] = useState(false);
  const [isLayoutUpdated, setIsLayoutUpdated] = useState(false);

  useLayoutEffect(() => {
    setIsLayoutUpdated(true);
    return () => {
      setIsLayoutUpdated(false);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsFocus(true);
      return () => {
        setIsFocus(false);
      };
    }, []),
  );

  useLayoutEffect(() => {
    if (!isScreenReaderEnabled || !isActive || !isFocus || !isLayoutUpdated || !autoFocusRef) {
      return;
    }

    // Call focus as soon as all considition is met
    focusOnElement(autoFocusRef);

    // Attempt to call it again just in case AccessibilityInfo.setAccessibilityFocus is delayed
    const timeoutId = setTimeout(() => {
      focusOnElement(autoFocusRef);
    }, AUTO_FOCUS_DELAY);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [autoFocusRef, isActive, isFocus, isLayoutUpdated, isScreenReaderEnabled]);

  return setAutoFocusRef;
};
