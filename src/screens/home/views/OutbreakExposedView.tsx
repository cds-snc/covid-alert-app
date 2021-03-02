import React from 'react';
import {RoundedBox, Text} from 'components';
import {useI18n} from 'locale';

import {BaseHomeView} from '../components/BaseHomeView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

import {NegativeOutbreakTestButton} from './ClearOutbreakExposureView';

const ExposureText = () => {
  const i18n = useI18n();
  return (
    <>
      <RoundedBox isFirstBox>
        <HomeScreenTitle>You have been exposed to an Outbreak</HomeScreenTitle>
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

export const OutbreakExposedView = () => {
  return (
    <BaseHomeView iconName="hand-caution" testID="outbreakExposure">
      <ExposureText />
    </BaseHomeView>
  );
};
