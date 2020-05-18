import React from 'react';
import {useTheme} from '@shopify/restyle';
import {Platform, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle, ActivityIndicator} from 'react-native';
import {Theme} from 'shared/theme';

import {Box} from './Box';
import {Ripple} from './Ripple';

export interface ButtonProps {
  text?: string;
  onPress: () => void;
  variant: keyof Theme['buttonVariants'];
  color?: keyof Theme['colors'];
  disabled?: boolean;
  loading?: boolean;
}

export const Button = ({text, onPress, variant, color: buttonColorName, disabled, loading}: ButtonProps) => {
  const theme = useTheme<Theme>();
  const variantProps = theme.buttonVariants[variant];
  const disabledProps = disabled ? variantProps.disabled || {} : {};
  const themedStyles = {...variantProps, ...disabledProps};
  const {fontSize, fontWeight, fontFamily, color, borderWidth, height} = (themedStyles as unknown) as TextStyle &
    ViewStyle;
  const textColor = themedStyles.textColor;
  const buttonColor = buttonColorName && theme.colors[buttonColorName];

  const onPressHandler = loading ? () => {} : onPress;

  const content = (
    <Box
      borderRadius={4}
      alignItems="center"
      justifyContent="center"
      style={{backgroundColor: color, minHeight: height, borderWidth, borderColor: buttonColor}}
      paddingHorizontal="m"
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="large" />
      ) : (
        <Text style={{color: textColor || buttonColor, fontWeight, fontFamily, fontSize}}>{text}</Text>
      )}
    </Box>
  );

  if (Platform.OS === 'android') {
    return (
      <Ripple rippleContainerBorderRadius={4} rippleDuration={500} onPress={onPressHandler}>
        {content}
      </Ripple>
    );
  }
  return (
    <TouchableOpacity onPress={onPressHandler} style={styles.stretch} disabled={disabled}>
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stretch: {
    alignSelf: 'stretch',
  },
});
