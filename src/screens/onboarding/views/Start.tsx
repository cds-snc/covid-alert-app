import React from 'react';
import {Box, Text} from 'components';
import {useI18n} from 'locale';

import {ItemView} from './ItemView';

export const Start = () => {
  const i18n = useI18n();
  return (
    <ItemView
      image={require('assets/onboarding-start.png')}
      altText={i18n.translate('Onboarding.Start.ImageAltText')}
      header={i18n.translate('Onboarding.Start.Title')}
      item="step-1"
    >
      <>
        <Box marginBottom="m">
          <Text variant="bodyText" color="overlayBodyText">
            {i18n.translate('Onboarding.Start.Body1')}
          </Text>
        </Box>
        <Box marginBottom="m">
          <Text variant="bodyText" color="overlayBodyText">
            {i18n.translate('Onboarding.Start.Body2')}
          </Text>
        </Box>
      </>
    </ItemView>
  );
};
