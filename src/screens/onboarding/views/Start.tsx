import React from 'react';
import {Box, Text, OnboardingHeader} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {ItemViewProps} from './ItemView';

export const Start = (props: Pick<ItemViewProps, 'isActive'>) => {
  const [i18n] = useI18n();

  return (
    <>
      <OnboardingHeader
        text={i18n.translate('Onboarding.Start.Title')}
        imageSrc={require('assets/onboarding-start.png')}
        accessible
        accessibilityLabel={i18n.translate('Onboarding.Start.ImageAltText')}
      />
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
  );
};
