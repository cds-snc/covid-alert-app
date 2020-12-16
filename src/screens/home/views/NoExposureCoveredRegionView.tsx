import React from 'react';
import {Box, Text, TextMultiline} from 'components';
import {useI18n} from 'locale';
import {useStorage} from 'services/StorageService';
import {hoursFromNow} from 'shared/date-fns';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

import {AllSetView} from '../components/AllSetView';
import {BaseHomeView} from '../components/BaseHomeView';
import {StyleSheet, Platform} from 'react-native';

export const NoExposureCoveredRegionView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const {onboardedDatetime, skipAllSet} = useStorage();
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);

  if (!skipAllSet && onboardedDatetime && hoursFromNow(onboardedDatetime) < 24) {
    return (
      <BaseHomeView iconName="thumbs-up">
        <AllSetView
          testID="allSetCoveredRegionView"
          isBottomSheetExpanded={isBottomSheetExpanded}
          titleText={i18n.translate('Home.NoExposureDetected.AllSetTitle')}
          bodyText={i18n.translate('Home.NoExposureDetected.RegionCovered.AllSetBody')}
        />
      </BaseHomeView>
    );
  }
  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView iconName="thumbs-up">
      <Box alignSelf="stretch" style={styles.roundedBox1}>
        <Box paddingHorizontal="m" paddingVertical="m">
          <Text
            testID="coveredRegionHeader"
            focusRef={autoFocusRef}
            variant="bodyTitle"
            color="bodyText"
            marginBottom="m"
            accessibilityRole="header"
            accessibilityAutoFocus
          >
            {i18n.translate('Home.NoExposureDetected.RegionCovered.Title')}
          </Text>
          <TextMultiline
            variant="bodyText"
            color="bodyText"
            marginBottom="m"
            text={i18n.translate('Home.NoExposureDetected.RegionCovered.Body')}
          />
        </Box>
      </Box>

      <Box alignSelf="stretch" marginTop="m" style={styles.roundedBox2}>
        <Box paddingHorizontal="m" paddingVertical="m">
          <Text
            variant="bodySubTitle"
            color="bodyText"
            marginBottom="m"
            accessibilityRole="header"
            accessibilityAutoFocus
          >
            {i18n.translate('Home.NoExposureDetected.WhatsNew.Title')}
          </Text>

          <TextMultiline
            variant="bodyText"
            color="bodyText"
            marginBottom="m"
            text={i18n.translate('Home.NoExposureDetected.WhatsNew.Body1')}
          />

          <TextMultiline
            variant="bodyText"
            color="bodyText"
            marginBottom="m"
            text={i18n.translate('Home.NoExposureDetected.WhatsNew.Body2')}
          />
        </Box>
      </Box>
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
