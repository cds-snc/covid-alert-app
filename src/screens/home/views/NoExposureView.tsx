import React from 'react';
import {Text, Box} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureView = () => {
  const [i18n] = useI18n();
  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView>
      <Text variant="bodyTitle" color="bodyTextNutmeg" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected')}
      </Text>
      <Text variant="bodyText" color="bodyText">
        {i18n.translate('Home.NoExposureDetectedDetailed')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginTop="l">
        {i18n.translate('Home.NoExposureDetectedProvinces')}
      </Text>
      {/* <LastCheckedDisplay /> */}
      {/* centering looks off without this, because other screens with animations have a button */}
      <Box height={50} />
    </BaseHomeView>
  );
};
