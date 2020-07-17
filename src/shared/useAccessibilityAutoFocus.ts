import {useEffect, useLayoutEffect, useState} from 'react';
import {AccessibilityInfo, findNodeHandle} from 'react-native';

import {createCancellableCallbackPromise} from './cancellablePromise';

/**
 * Look like there is timing issue with AccessibilityInfo.setAccessibilityFocus
 * Ref https://github.com/react-native-community/discussions-and-proposals/issues/118
 */
const AUTO_FOCUS_DELAY = 200;

export const focusOnElement = (elementRef: any) => {
  const node = findNodeHandle(elementRef);
  if (!node) {
    return;
  }
  AccessibilityInfo.setAccessibilityFocus(node);
};

/**
 * Remember to add `accessible={true}` to target component
 */
export const useAccessibilityAutoFocus = (isActive = true, navigation: any = null) => {
  const [autoFocusRef, setAutoFocusRef] = useState<any>();
  const {callable, cancelable} = createCancellableCallbackPromise(
    () => AccessibilityInfo.isScreenReaderEnabled().then(delay(AUTO_FOCUS_DELAY)),
    isScreenReaderEnabled => {
      if (!isScreenReaderEnabled) {
        return;
      }
      focusOnElement(autoFocusRef);
    },
  );

  useEffect(() => {
    if (navigation) {
      const unsubscribe = navigation.addListener('focus', () => {
        callable();
        return cancelable;
      });
      return unsubscribe;
    }
  }, [callable, cancelable, navigation]);

  useLayoutEffect(() => {
    if (!autoFocusRef || !isActive) {
      return;
    }

    callable();
    return cancelable;
  }, [callable, cancelable, autoFocusRef, isActive]);

  return setAutoFocusRef;
};

function delay<T>(timeout: number) {
  return (value: T) => {
    return new Promise<T>(function(resolve) {
      setTimeout(resolve.bind(null, value), timeout);
    });
  };
}
