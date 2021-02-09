import React from 'react';
import {Text, TextMultiline} from 'components';
import {useI18n} from 'locale';
import {useStorage} from 'services/StorageService';
import {hoursFromNow} from 'shared/date-fns';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

import {ExposureStatusWrapper} from '../components/BaseHomeView';
import {AllSetView} from '../components/AllSetView';

export const NoExposureUncoveredRegionView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const {onboardedDatetime, skipAllSet} = useStorage();
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);

  if (!skipAllSet && onboardedDatetime && hoursFromNow(onboardedDatetime) < 24) {
    return (
      <ExposureStatusWrapper iconName="hand-no-province-yet">
        <AllSetView
          testID="allSetUncoveredRegionView"
          isBottomSheetExpanded
          titleText={i18n.translate('Home.NoExposureDetected.RegionNotCovered.Title')}
          bodyText={i18n.translate('Home.NoExposureDetected.RegionNotCovered.AllSetBody')}
        />
      </ExposureStatusWrapper>
    );
  }
  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <ExposureStatusWrapper iconName="hand-no-province-yet">
      <Text
        testID="uncoveredRegionHeader"
        focusRef={autoFocusRef}
        variant="bodyTitle"
        color="bodyText"
        marginBottom="m"
        accessibilityRole="header"
        accessibilityAutoFocus
      >
        {i18n.translate('Home.NoExposureDetected.RegionNotCovered.Title')}
      </Text>
      <TextMultiline
        variant="bodyText"
        color="bodyText"
        marginBottom="m"
        text={i18n.translate('Home.NoExposureDetected.RegionNotCovered.Body')}
      />
    </ExposureStatusWrapper>
  );
};
