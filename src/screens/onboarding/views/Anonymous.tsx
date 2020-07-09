import React from 'react';
import {Box, BulletPointX, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {ItemView, ItemViewProps} from './ItemView';

export const Anonymous = (props: Pick<ItemViewProps, 'isActive'>) => {
  const [i18n] = useI18n();

  return (
    <ItemView
      {...props}
      image={require('assets/onboarding-nogps.png')}
      altText={i18n.translate('Onboarding.Anonymous.ImageAltText')}
      header={i18n.translate('Onboarding.Anonymous.Title')}
      item="step-2"
    >
      <>
        <Box flexDirection="row" marginBottom="m">
          <Text variant="bodyText" color="overlayBodyText">
            {i18n.translate('Onboarding.Anonymous.Body1')}
          </Text>
        </Box>
        <Box flexDirection="row" marginBottom="s">
          <Text variant="bodyText" color="overlayBodyText">
            {i18n.translate('Onboarding.Anonymous.Body2')}
          </Text>
        </Box>

        <BulletPointX text={i18n.translate('Onboarding.Anonymous.Bullet1')} />
        <BulletPointX text={i18n.translate('Onboarding.Anonymous.Bullet2')} />
        <BulletPointX text={i18n.translate('Onboarding.Anonymous.Bullet3')} />
        <BulletPointX text={i18n.translate('Onboarding.Anonymous.Bullet4')} />
      </>
    </ItemView>
  );
};
