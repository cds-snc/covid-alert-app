import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {Box, Text, ButtonSingleLine} from 'components';
import {useNavigation} from '@react-navigation/native';

import {ItemView, ItemViewProps} from './ItemView';

export const Permissions = (props: Pick<ItemViewProps, 'isActive'>) => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const onPrivacy = useCallback(() => navigation.navigate('Privacy'), [navigation]);

  return (
    <ItemView
      {...props}
      image={require('assets/onboarding-enable.png')}
      altText={i18n.translate('Onboarding.Permissions.ImageAltText')}
      header={i18n.translate('Onboarding.Permissions.Title')}
      item="step-4"
    >
      <>
        <Box marginBottom="m">
          <Text variant="bodyText" color="overlayBodyText">
            {i18n.translate('Onboarding.Permissions.Body1')}
          </Text>
        </Box>
        <Box marginBottom="l">
          <Text variant="bodyText" color="overlayBodyText">
            {i18n.translate('Onboarding.Permissions.Body2')}
          </Text>
        </Box>
        <Box alignSelf="stretch" marginTop="m" marginBottom="l">
          <Box>
            <ButtonSingleLine
              text={i18n.translate('Onboarding.Permissions.PrivacyButtonCTA')}
              variant="bigFlatNeutralGrey"
              internalLink
              onPress={onPrivacy}
            />
          </Box>
        </Box>
      </>
    </ItemView>
  );
};
