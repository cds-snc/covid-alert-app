import React from 'react';
import {useI18n, useRegionalI18n} from 'locale';
import {Text} from 'components';
import {HomeScreenTitle} from 'screens/home/components/HomeScreenTitle';
import {ExposureDateView} from 'screens/home/views/ExposureDateView';
import {useCachedStorage} from 'services/StorageService';
import {isRegionActive} from 'shared/RegionLogic';
import {ExposedHelpButton} from 'components/ExposedHelpButton';

const ActiveContent = ({text}: {text: string}) => {
  if (text === '') {
    return null;
  }
  return <Text marginBottom="m">{text}</Text>;
};

export const ProximityExposureContent = ({timestamp}: {timestamp: number}) => {
  const {region} = useCachedStorage();
  const regionalI18n = useRegionalI18n();
  const regionActive = isRegionActive(region, regionalI18n.activeRegions);
  const i18n = useI18n();
  return (
    <>
      <HomeScreenTitle>{i18n.translate('Home.ExposureDetected.Title')}</HomeScreenTitle>
      <Text testID="bodyText" marginBottom="m">
        {i18n.translate('Home.ExposureDetected.Body1')}
      </Text>
      <ExposureDateView timestamp={timestamp} />
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.ExposureDetected.Title2')}
      </Text>
      {regionActive ? (
        <ActiveContent
          text={regionalI18n.translate(`RegionContent.ExposureView.Active.${region}.Body`)}
        /> /* pulls from region.json */
      ) : (
        <Text marginBottom="m">{i18n.translate('Home.ExposureDetected.Body2')}</Text>
      )}
      <ExposedHelpButton />
    </>
  );
};
