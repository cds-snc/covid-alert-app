import React from 'react';
import {Text, TextMultiline, LastCheckedDisplay} from 'components';
import {useI18n} from 'locale';
import {useStorage} from 'services/StorageService';
import {hoursFromNow} from 'shared/date-fns';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

import {BaseHomeView} from '../components/BaseHomeView';
import {AllSetView} from '../components/AllSetView';

export const NoExposureNoRegionView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const {onboardedDatetime, skipAllSet} = useStorage();

  const [, autoFocusRef] = useAccessibilityAutoFocus(!isBottomSheetExpanded);

  if (!skipAllSet && onboardedDatetime && hoursFromNow(onboardedDatetime) < 24) {
    return (
      <AllSetView
        isBottomSheetExpanded={isBottomSheetExpanded}
        titleText={i18n.translate('Home.NoExposureDetected.AllSetTitle')}
        bodyText={i18n.translate('Home.NoExposureDetected.NoRegion.AllSetBody')}
      />
    );
  }

  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView>
      <Text focusRef={autoFocusRef} variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected.NoRegion.Title')}
      </Text>

      <TextMultiline
        variant="bodyText"
        color="bodyText"
        marginBottom="m"
        text={i18n.translate('Home.NoExposureDetected.NoRegion.Body')}
      />
      <LastCheckedDisplay textDark />
    </BaseHomeView>
  );
};
