import React from 'react';
import {useI18n} from 'locale';
import {Box, BulletPointPurple} from 'components';

import {ItemView} from './ItemView';

export const PartOf = () => {
  const i18n = useI18n();

  return (
    <ItemView
      image={require('assets/onboarding-partof.png')}
      altText={i18n.translate('Onboarding.PartOf.ImageAltText')}
      header={i18n.translate('Onboarding.PartOf.Title')}
      item="step-4"
    >
      <>
        <Box marginRight="s">
          <BulletPointPurple listAccessibile="listStart" text={i18n.translate('Onboarding.PartOf.Body1')} />
          <BulletPointPurple listAccessibile="item" text={i18n.translate('Onboarding.PartOf.Body2')} />
          <BulletPointPurple listAccessibile="listEnd" text={i18n.translate('Onboarding.PartOf.Body3')} />
        </Box>
      </>
    </ItemView>
  );
};
