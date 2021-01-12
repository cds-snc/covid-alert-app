import React from 'react';
import {Text, TextMultiline, RoundedBox} from 'components';
import {useI18n} from 'locale';
import {useStorage} from 'services/StorageService';
import {hoursFromNow} from 'shared/date-fns';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {Platform} from 'react-native';

import {AllSetView} from '../components/AllSetView';
import {BaseHomeView} from '../components/BaseHomeView';
import {WhatsNew} from '../components/WhatsNewView';

const TextContent = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);
  return (
    <>
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
    </>
  );
};

export const NoExposureCoveredRegionView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const {onboardedDatetime, skipAllSet} = useStorage();

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
      {Platform.OS === 'ios' ? (
        <TextContent isBottomSheetExpanded={isBottomSheetExpanded} />
      ) : (
        <RoundedBox isBoxOne>
          <TextContent isBottomSheetExpanded={isBottomSheetExpanded} />
        </RoundedBox>
      )}
      <WhatsNew />
    </BaseHomeView>
  );
};
