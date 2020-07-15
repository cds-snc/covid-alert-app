import React from 'react';
import {Box, Text} from 'components';
import {useI18n} from 'locale';

import {ItemView, ItemViewProps} from './ItemView';

export const Start = (props: Pick<ItemViewProps, 'isActive'>) => {
  const i18n = useI18n();

  return (
    <ItemView
      {...props}
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
