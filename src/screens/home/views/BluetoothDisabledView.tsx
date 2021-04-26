import React from 'react';
import {useI18n} from 'locale';
import {Text} from 'components';

import {BaseHomeView} from '../components/BaseHomeView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

export const BluetoothDisabledView = () => {
  const i18n = useI18n();

  return (
    <BaseHomeView iconName="icon-bluetooth-disabled">
      <HomeScreenTitle>{i18n.translate('Home.BluetoothDisabled')}</HomeScreenTitle>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.EnableBluetoothCTA')}
      </Text>
    </BaseHomeView>
  );
};
