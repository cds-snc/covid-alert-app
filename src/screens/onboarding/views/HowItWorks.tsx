import React, {useCallback, useRef, useState} from 'react';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {Box, BulletPointCheck, ButtonSingleLine} from 'components';

import {ItemView, ItemViewProps} from './ItemView';
import {useAccessibilityManualFocus} from 'shared/useAccessibilityManualFocus';

export const HowItWorks = (props: Pick<ItemViewProps, 'isActive'>) => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const onLearnMore = useCallback(() => navigation.navigate('Tutorial'), [navigation]);
  const focusRef = useRef(null);
  const [ignoreAutoFocus, setIgnoreAutoFocus] = useState(false);
  useAccessibilityManualFocus(focusRef.current, navigation, setIgnoreAutoFocus);

  return (
    <ItemView
      {...props}
      autoFocus={!ignoreAutoFocus}
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
              focusRef={focusRef}
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
