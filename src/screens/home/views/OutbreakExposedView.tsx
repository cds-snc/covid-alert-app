import React from 'react';
import {Box, Text, RoundedBox} from 'components';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {StyleSheet, Platform} from 'react-native';
import {useI18n} from 'locale';

import {BaseHomeView} from '../components/BaseHomeView';

import {NegativeOutbreakTestButton} from './ClearOutbreakExposureView';

const ExposureText = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);
  const i18n = useI18n();
  return (
    <>
      <RoundedBox isFirstBox>
        <Text focusRef={autoFocusRef} variant="bodyTitle" marginBottom="m" accessibilityRole="header">
          You have been exposed to an Outbreak
        </Text>
        <Text marginBottom="m">[Placeholder] There was an outbreak at one of the locations you scanned.</Text>
      </RoundedBox>

      <RoundedBox isFirstBox={false}>
        <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
          {i18n.translate('Home.ExposureDetected.Title2')}
        </Text>
        <Text marginBottom="m">{i18n.translate('Home.ExposureDetected.Body2')}</Text>
        <NegativeOutbreakTestButton />
      </RoundedBox>
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
