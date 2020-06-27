import React from 'react';
import {Box, Text} from 'components';
import {Image, StyleSheet, ImageSourcePropType} from 'react-native';

interface OnboardingHeaderProps {
  text: string;
  imageSrc?: ImageSourcePropType;
}

export const OnboardingHeader = ({text, imageSrc}: OnboardingHeaderProps) => {
  return (
    <Box>
      {imageSrc && <Image style={styles.image} source={imageSrc} />}
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
    height: 273,
    marginBottom: 30,
    resizeMode: 'contain',
  },
});
