import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {Box, ButtonSingleLine} from 'components';
import Markdown from 'react-native-markdown-display';
import {Linking, StyleSheet} from 'react-native';
import {captureException} from 'shared/log';

import {ItemView, ItemViewProps} from './ItemView';

export const Permissions = (props: Pick<ItemViewProps, 'isActive'>) => {
  const i18n = useI18n();
  const onPrivacy = useCallback(() => {
    Linking.openURL(i18n.translate('Info.PrivacyUrl')).catch(error => captureException('An error occurred', error));
  }, [i18n]);

  return (
    <ItemView
      {...props}
      image={require('assets/onboarding-enable.png')}
      altText={i18n.translate('Onboarding.Permissions.ImageAltText')}
      header={i18n.translate('Onboarding.Permissions.Title')}
      item="step-5"
    >
      <>
        <Box marginBottom="m">
          <Markdown
            style={{
              body: styles.bodyContent,
            }}
          >
            {i18n.translate('Onboarding.Permissions.Body1')}
          </Markdown>
        </Box>
        <Box marginBottom="l">
          <Markdown
            style={{
              body: styles.bodyContent,
            }}
          >
            {i18n.translate('Onboarding.Permissions.Body2')}
          </Markdown>
        </Box>
        <Box alignSelf="stretch" marginTop="m" marginBottom="l">
          <Box>
            <ButtonSingleLine
              testID="privacyPolicyCTA"
              text={i18n.translate('Onboarding.Permissions.PrivacyButtonCTA')}
              variant="bigFlatNeutralGrey"
              externalLink
              onPress={onPrivacy}
            />
          </Box>
        </Box>
      </>
    </ItemView>
  );
};
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  bodyContent: {
    fontFamily: 'Noto Sans',
    fontSize: 18,
  },
});
