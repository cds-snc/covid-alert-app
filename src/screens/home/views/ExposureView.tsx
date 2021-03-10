import React from 'react';
import {useI18n} from 'locale';
import {Text, RoundedBox} from 'components';
import {isRegionActive} from 'shared/RegionLogic';
import {useCachedStorage} from 'services/StorageService';
import {useRegionalI18n} from 'locale/regional';
import {ExposedHelpButton} from 'components/ExposedHelpButton';

import {BaseHomeView} from '../components/BaseHomeView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

import {ExposureDateView} from './ExposureDateView';
import {NegativeTestButton} from './ClearExposureView';

const ActiveContent = ({text}: {text: string}) => {
  if (text === '') {
    return null;
  }
  return <Text marginBottom="m">{text}</Text>;
};

const ExposureText = () => {
  const {region} = useCachedStorage();
  const regionalI18n = useRegionalI18n();
  const regionActive = isRegionActive(region, regionalI18n.activeRegions);
  const i18n = useI18n();

  return (
    <>
      <RoundedBox isFirstBox>
        <HomeScreenTitle>{i18n.translate('Home.ExposureDetected.Title')}</HomeScreenTitle>
        <Text testID="bodyText" marginBottom="m">
          {i18n.translate('Home.ExposureDetected.Body1')}
        </Text>
        <ExposureDateView />
      </RoundedBox>

      <RoundedBox isFirstBox={false}>
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
        <NegativeTestButton />
      </RoundedBox>
    </>
  );
};

export const ExposureView = () => {
  return (
    <BaseHomeView iconName="hand-caution" testID="exposure">
      <ExposureText />
    </BaseHomeView>
  );
};
