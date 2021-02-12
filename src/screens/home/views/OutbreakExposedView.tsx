import React from 'react';
import {Box, Text} from 'components';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {StyleSheet, Platform} from 'react-native';

import {BaseHomeView} from '../components/BaseHomeView';

const ExposureText = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);
  return (
    <>
      <Box alignSelf="stretch" style={styles.roundedBox1}>
        <Box paddingHorizontal="m" paddingVertical="m">
          <Text focusRef={autoFocusRef} variant="bodyTitle" marginBottom="m" accessibilityRole="header">
            You have been exposed to an Outbreak
          </Text>
          <Text marginBottom="m">[Placeholder] There was an outbreak at one of the locations you scanned.</Text>
        </Box>
      </Box>
    </>
  );
};

export const OutbreakExposedView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  return (
    <BaseHomeView iconName="hand-caution" testID="outbreakExposure">
      <ExposureText isBottomSheetExpanded={isBottomSheetExpanded} />
    </BaseHomeView>
  );
};

const styles = StyleSheet.create({
  roundedBox1: {
    marginTop: Platform.OS === 'ios' ? 5 : -20,
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: -1,
  },
  roundedBox2: {
    borderRadius: 10,
    backgroundColor: 'white',
  },
});
