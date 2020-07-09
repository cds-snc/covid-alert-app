import React, {ReactNode} from 'react';
import {StyleSheet, Image, ImageSourcePropType} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

import {onboardingData, OnboardingKey} from '../OnboardingContent';

export interface ItemViewProps {
  item: OnboardingKey;
  image?: ImageSourcePropType;
  altText?: string;
  header: string;
  isActive: boolean;
  children?: ReactNode;
}

export const ItemView = ({item, image, isActive, altText, header, children}: ItemViewProps) => {
  const [i18n] = useI18n();
  const accessibilityAutoFocusRef = useAccessibilityAutoFocus(isActive);

  const total = onboardingData.length;
  const step = i18n.translate('Onboarding.Step');
  const of = i18n.translate('Onboarding.Of');
  const x = onboardingData.indexOf(item) + 1;
  const stepText = `${step} ${x} ${of} ${total}`;

  return (
    <>
      {image ? (
        <Box marginHorizontal="-m">
          <Image
            accessible
            ref={accessibilityAutoFocusRef}
            style={styles.image}
            source={image}
            accessibilityLabel={altText}
          />
        </Box>
      ) : null}
      <Text marginBottom="s" marginTop="l" color="gray2">
        {stepText}
      </Text>
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
