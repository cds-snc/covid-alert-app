import React from 'react';
import {Text, Box, LastCheckedDisplay} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureView = () => {
  const [i18n] = useI18n();
  return (
    <BaseHomeView iconName="icon-offline">
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected')}
      </Text>
      <Text variant="bodyText" color="bodyText">
        {i18n.translate('Home.NoExposureDetectedDetailed')}
      </Text>
      <LastCheckedDisplay />
      {/* centering looks off without this, because other screens with animations have a button */}
      <Box height={50} />
    </BaseHomeView>
  );
};
