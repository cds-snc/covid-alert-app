import {useEffect} from 'react';
import {useAccessibilityService} from 'services/AccessibilityService';
import {useFocusEffect} from '@react-navigation/native';

/**
 * Focus on ref automatically when navigation focuses on this screen
 * @param focusRef - The ref to focus to
 * @param navigation  - The current navigation provider
 */
export const useAccessibilityNavigationFocus = (
  focusRef: React.LegacyRef<any>,
  navigation?: any,
  useBothEffects = false,
) => {
  const accessibilityService = useAccessibilityService();
  useFocusEffect(() => {
    if (!useBothEffects || navigation) {
      return;
    }

    accessibilityService.focusOnElement(focusRef);
  });
  useEffect(() => {
    if (!navigation) {
      return;
    }

    const unsubscribe = navigation.addListener('focus', () => {
      accessibilityService.focusOnElement(focusRef);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, focusRef, accessibilityService, useBothEffects]);
};
