import React from 'react';
import {useI18n} from 'locale';
import {Text} from 'components';

import {BaseHomeView} from '../components/BaseHomeView';
import {ExposedHelpButton} from '../../../components/ExposedHelpButton';

//

export const NetworkDisabledView = () => {
  const i18n = useI18n();
  return (
    <BaseHomeView iconName="icon-bluetooth-disabled">
      <ExposedHelpButton />
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.NoConnectivity')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.NoConnectivityDetailed')}
      </Text>
    </BaseHomeView>
  );
};
