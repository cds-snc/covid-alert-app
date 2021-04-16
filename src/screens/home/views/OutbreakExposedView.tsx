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
        <HomeScreenTitle>{i18n.translate(`QRCode.OutbreakExposed.Title`)}</HomeScreenTitle>
        <Text marginBottom="m">{i18n.translate(`QRCode.OutbreakExposed.Body`)}</Text>
      </RoundedBox>

      <RoundedBox isFirstBox={false}>
        <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
          {i18n.translate('QRCode.OutbreakExposed.NextSteps.Title')}
        </Text>
        <Text marginBottom="m">{i18n.translate('QRCode.OutbreakExposed.NextSteps.Body')}</Text>
        <NegativeOutbreakTestButton />
      </RoundedBox>
    </>
  );
};

export const OutbreakExposedView = () => {
  return (
    <BaseHomeView
      iconName="hand-caution-yellow"
      testID="outbreakExposure"
      // eslint-disable-next-line react-native/no-inline-styles
      primaryIconStyles={{marginLeft: -20, marginBottom: 20}}
    >
      <ExposureText />
    </BaseHomeView>
  );
};
