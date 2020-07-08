import React from 'react';
import {Box, Text} from 'components';
import {Image, StyleSheet, ImageSourcePropType} from 'react-native';

interface OnboardingHeaderProps {
  text: string;
  imageSrc?: ImageSourcePropType;
  accessible?: boolean;
  accessibilityLabel?: string;
}

export const OnboardingHeader = ({text, imageSrc, accessible, accessibilityLabel}: OnboardingHeaderProps) => {
  return (
    <Box>
      <Box marginHorizontal="-m">
        {imageSrc && (
          <Image
            accessible={accessible}
            accessibilityLabel={accessibilityLabel}
            style={styles.image}
            source={imageSrc}
          />
        )}
      </Box>
      <Text variant="bodyTitle" color="overlayBodyText" marginBottom="l" accessibilityRole="header">
        {text}
      </Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    height: 168,
    marginBottom: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
