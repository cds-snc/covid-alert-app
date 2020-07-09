import React from 'react';
import {Text, TextMultiline, LastCheckedDisplay} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';
import {hoursFromNow} from 'shared/date-fns';

import {AllSetView} from '../components/AllSetView';
import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureCoveredRegionView = () => {
  const [i18n] = useI18n();
  const {onboardedDatetime, skipAllSet} = useStorage();

  if (!skipAllSet && onboardedDatetime && hoursFromNow(onboardedDatetime) < 24) {
    return (
      <AllSetView
        titleText={i18n.translate('Home.NoExposureDetected.AllSetTitle')}
        bodyText={i18n.translate('Home.NoExposureDetected.RegionCovered.AllSetBody')}
      />
    );
  }
  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView iconName="thumbs-up">
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header" accessibilityAutoFocus>
        {i18n.translate('Home.NoExposureDetected.RegionCovered.Title')}
      </Text>
      <TextMultiline
        variant="bodyText"
        color="bodyText"
        marginBottom="m"
        text={i18n.translate('Home.NoExposureDetected.RegionCovered.Body')}
      />
      <LastCheckedDisplay textDark />
    </BaseHomeView>
  );
};
