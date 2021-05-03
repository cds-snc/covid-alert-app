import React from 'react';
import {useI18n} from 'locale';
import {Text} from 'components';

import {BaseHomeView} from '../home/components/BaseHomeView';

export const RecentExposureScreen = () => {
  const i18n = useI18n();

  return (
    <BaseHomeView iconName="icon-bluetooth-disabled">
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.EnableBluetoothCTA')}
      </Text>
    </BaseHomeView>
  );
};
