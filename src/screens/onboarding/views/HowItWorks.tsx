import React, {useCallback} from 'react';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';
import {Box, BulletPointCheck, ButtonSingleLine} from 'components';

import {ItemView, ItemViewProps} from './ItemView';

export const HowItWorks = (props: Pick<ItemViewProps, 'isActive'>) => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const onLearnMore = useCallback(() => navigation.navigate('Tutorial'), [navigation]);

  return (
    <ItemView
      {...props}
      image={require('assets/onboarding-howitworks.png')}
      altText={i18n.translate('Onboarding.HowItWorks.ImageAltText')}
      header={i18n.translate('Onboarding.HowItWorks.Title')}
      item="step-4"
    >
      <>
        <BulletPointCheck text={i18n.translate('Onboarding.HowItWorks.Body1')} />
        <BulletPointCheck text={i18n.translate('Onboarding.HowItWorks.Body2')} />
        <BulletPointCheck text={i18n.translate('Onboarding.HowItWorks.Body3')} />

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
