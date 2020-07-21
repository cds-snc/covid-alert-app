import {useEffect} from 'react';
import {focusOnElement} from './useAccessibilityAutoFocus';

export const useAccessibilityManualFocus = (
  focusRef: React.LegacyRef<any>,
  navigation: any,
  setIgnoreAutoFocus: (value: boolean) => void,
) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIgnoreAutoFocus(true);
      focusOnElement(focusRef);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, focusRef, setIgnoreAutoFocus]);
};
