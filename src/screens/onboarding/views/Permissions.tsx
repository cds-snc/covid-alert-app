import React, {useCallback, useRef, useState, useEffect} from 'react';
import {useI18n} from 'locale';
import {Box, ButtonSingleLine} from 'components';
import {useNavigation} from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import {StyleSheet} from 'react-native';
import {focusOnElement} from 'shared/useAccessibilityAutoFocus';

import {ItemView, ItemViewProps} from './ItemView';

export const Permissions = (props: Pick<ItemViewProps, 'isActive'>) => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const onPrivacy = useCallback(() => navigation.navigate('Privacy'), [navigation]);
  const focusRef = useRef(null);
  const [focusOnButton, setFocusOnButton] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setFocusOnButton(true);
      focusOnElement(focusRef.current);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  return (
    <ItemView
      {...props}
      autoFocus={!focusOnButton}
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
              focusRef={focusRef}
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
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  bodyContent: {
    fontFamily: 'Noto Sans',
    fontSize: 18,
  },
});
