import React from 'react';
import {useI18n} from 'locale';
import {Box, Text} from 'components';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {isRegionActive} from 'shared/RegionLogic';
import {useStorage} from 'services/StorageService';
import {useRegionalI18n} from 'locale/regional';
import {ExposedHelpButton} from 'components/ExposedHelpButton';
import {StyleSheet, Platform} from 'react-native';

import {BaseHomeView} from '../components/BaseHomeView';

/* import {ExposureDateView} from './ExposureDateView'; */
import {NegativeTestButton} from './ClearExposureView';

const ActiveContent = ({text}: {text: string}) => {
  if (text === '') {
    return null;
  }
  return <Text marginBottom="m">{text}</Text>;
};

const ExposureText = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const {region} = useStorage();
  const regionalI18n = useRegionalI18n();
  const regionActive = isRegionActive(region, regionalI18n.activeRegions);
  const i18n = useI18n();
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);
  const activeBodyText = regionalI18n.translate(`RegionContent.ExposureView.Active.${region}.Body`);

  return (
    <>
      <Box style={styles.roundedBox1}>
        <Box paddingHorizontal="m" paddingVertical="m">
          <Text focusRef={autoFocusRef} variant="bodyTitle" marginTop="m" marginBottom="m" accessibilityRole="header">
            {i18n.translate('Home.ExposureDetected.Title')}
          </Text>
          <Text marginBottom="m">{i18n.translate('Home.ExposureDetected.Body1')}</Text>
          {/* <ExposureDateView /> */}
        </Box>
      </Box>

      <Box marginTop="m" style={styles.roundedBox2}>
        <Box paddingHorizontal="m" paddingVertical="m">
          <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
            {i18n.translate('Home.ExposureDetected.Title2')}
          </Text>
          {regionActive ? (
            <ActiveContent text={activeBodyText} /> /* pulls from region.json */
          ) : (
            <Text marginBottom="m">{i18n.translate('Home.ExposureDetected.Body2')}</Text>
          )}
          <ExposedHelpButton />
          <NegativeTestButton />
        </Box>
      </Box>
    </>
  );
};

export const ExposureView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  return (
    <BaseHomeView iconName="hand-caution" testID="exposure">
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
