import React, {ReactNode} from 'react';
import {StyleSheet, Image, ImageSourcePropType} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {focusOnElement, useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {useFocusEffect} from '@react-navigation/native';

import {onboardingData, OnboardingKey} from '../OnboardingContent';

export interface ItemViewProps {
  item: OnboardingKey;
  image?: ImageSourcePropType;
  altText?: string;
  header: string;
  isActive: boolean;
  children?: ReactNode;
  autoFocus?: boolean;
}

export const ItemView = ({item, image, isActive, altText, header, children, autoFocus = true}: ItemViewProps) => {
  const i18n = useI18n();
  const [focusRef, autoFocusRef] = useAccessibilityAutoFocus(isActive);
  const total = onboardingData.length;
  const step = i18n.translate('Onboarding.Step');
  const of = i18n.translate('Onboarding.Of');
  const x = onboardingData.indexOf(item) + 1;
  const stepText = `${step} ${x} ${of} ${total}`;

  useFocusEffect(() => {
    if (isActive && autoFocus) focusOnElement(focusRef);
  });
  return (
    <>
      <Text focusRef={autoFocusRef} marginBottom="s" marginTop="s" color="gray2">
        {stepText}
      </Text>
      {image ? (
        <Box marginHorizontal="-m" marginTop="s" marginBottom="l" borderBottomWidth={2} borderBottomColor="gray5">
          <Image accessible style={styles.image} source={image} accessibilityLabel={altText} />
        </Box>
      ) : null}

      <Text variant="bodyTitle" color="overlayBodyText" marginBottom="l" accessibilityRole="header">
        {header}
      </Text>
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 168,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
