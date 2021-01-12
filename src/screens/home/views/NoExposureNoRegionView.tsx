import React from 'react';
import {RoundedBox, Text, TextMultiline} from 'components';
import {useI18n} from 'locale';
import {useStorage} from 'services/StorageService';
import {hoursFromNow} from 'shared/date-fns';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {Platform} from 'react-native';

import {BaseHomeView} from '../components/BaseHomeView';
import {AllSetView} from '../components/AllSetView';
import {WhatsNew} from '../components/WhatsNewView';

const TextContent = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);
  return (
    <>
      <Text
        testID="noRegionHeader"
        focusRef={autoFocusRef}
        variant="bodyTitle"
        color="bodyText"
        marginBottom="m"
        accessibilityRole="header"
      >
        {i18n.translate('Home.NoExposureDetected.NoRegion.Title')}
      </Text>

      <TextMultiline
        variant="bodyText"
        color="bodyText"
        marginBottom="m"
        text={i18n.translate('Home.NoExposureDetected.NoRegion.Body')}
      />
    </>
  );
};

export const NoExposureNoRegionView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const {onboardedDatetime, skipAllSet} = useStorage();

  if (!skipAllSet && onboardedDatetime && hoursFromNow(onboardedDatetime) < 24) {
    return (
      <BaseHomeView iconName="thumbs-up">
        <AllSetView
          testID="allSetNoRegionView"
          isBottomSheetExpanded={isBottomSheetExpanded}
          titleText={i18n.translate('Home.NoExposureDetected.AllSetTitle')}
          bodyText={i18n.translate('Home.NoExposureDetected.NoRegion.AllSetBody')}
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
