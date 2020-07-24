import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {Box, BulletPointCheck, ButtonSingleLine} from 'components';

import {ItemView} from './ItemView';

export const HowItWorks = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const onLearnMore = useCallback(() => navigation.navigate('Tutorial'), [navigation]);

  return (
    <ItemView
      image={require('assets/onboarding-howitworks.png')}
      altText={i18n.translate('Onboarding.HowItWorks.ImageAltText')}
      header={i18n.translate('Onboarding.HowItWorks.Title')}
      item="step-3"
    >
      <>
        <Box marginRight="s">
          <BulletPointCheck listAccessibile="listStart" text={i18n.translate('Onboarding.HowItWorks.Body1')} />
          <BulletPointCheck listAccessibile="item" text={i18n.translate('Onboarding.HowItWorks.Body2')} />
          <BulletPointCheck listAccessibile="listEnd" text={i18n.translate('Onboarding.HowItWorks.Body3')} />
        </Box>
        <Box alignSelf="stretch" marginTop="m" marginBottom="l">
          <Box>
            <ButtonSingleLine
              text={i18n.translate('Onboarding.HowItWorks.HowItWorksCTA')}
              variant="bigFlatNeutralGrey"
              internalLink
              onPress={onLearnMore}
            />
          </Box>
        </Box>
      </>
    </ItemView>
  );
};
