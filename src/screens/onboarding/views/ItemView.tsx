import React, {useRef, useLayoutEffect, ReactNode} from 'react';
import {StyleSheet, Image, ImageSourcePropType, AccessibilityInfo, findNodeHandle} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

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
  const imageRef = useRef<any>();
  const [i18n] = useI18n();

  useLayoutEffect(() => {
    const tag = findNodeHandle(imageRef.current);
    if (isActive && tag) {
      AccessibilityInfo.setAccessibilityFocus(tag);
    }
  }, [isActive, item]);

  const total = onboardingData.length;
  const step = i18n.translate('Onboarding.Step');
  const of = i18n.translate('Onboarding.Of');
  const x = onboardingData.indexOf(item) + 1;
  const stepText = `${step} ${x} ${of} ${total}`;

  return (
    <>
      {image ? (
        <Box marginHorizontal="-m">
          <Image ref={imageRef} style={styles.image} source={image} accessible accessibilityLabel={altText} />
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
