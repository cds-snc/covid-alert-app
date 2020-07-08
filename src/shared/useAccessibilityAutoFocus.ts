import {useLayoutEffect, useState} from 'react';
import {AccessibilityInfo, findNodeHandle, InteractionManager} from 'react-native';

/**
 * Remember to add `accessible={true}` to target component
 * Note: Look like there is timing issue related to this https://github.com/react-native-community/discussions-and-proposals/issues/118
 */
export const useAccessibilityAutoFocus = (isActive = true) => {
  const [autoFocusRef, setAutoFocusRef] = useState<any>();

  useLayoutEffect(() => {
    const {cancel} = InteractionManager.runAfterInteractions(() => {
      const node = findNodeHandle(autoFocusRef);
      if (!node || !isActive) {
        return;
      }
      AccessibilityInfo.setAccessibilityFocus(node);
    });
    return cancel;
  }, [autoFocusRef, isActive]);

  return setAutoFocusRef;
};
