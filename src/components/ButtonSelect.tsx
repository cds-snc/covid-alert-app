import React from 'react';
import {useTheme} from '@shopify/restyle';
import {StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import {Theme} from 'shared/theme';

import {Box} from './Box';
import {Icon, IconName} from './Icon';

export interface ButtonSelectProps {
  text?: string;
  onPress: () => void;
  variant: keyof Theme['buttonVariants'];
  color?: keyof Theme['colors'];
  disabled?: boolean;
  iconName?: IconName;
  testID?: string;
}

export const ButtonSelect = ({
  text,
  onPress,
  variant,
  color: buttonColorName,
  disabled,
  iconName,
  testID,
}: ButtonSelectProps) => {
  const theme = useTheme<Theme>();
  const variantProps = theme.buttonVariants[variant];
  const disabledProps = disabled ? variantProps.disabled || {} : {};
  const themedStyles = {...variantProps, ...disabledProps};
  const {fontSize, fontWeight, fontFamily} = (themedStyles as unknown) as TextStyle & ViewStyle;
  const textColor = themedStyles.textColor;
  const buttonColor = buttonColorName && theme.colors[buttonColorName];
  const borderColorName = (themedStyles.color as keyof Theme['colors']) || 'bodyText';
  const onPressHandler = onPress;
  const borderRadius = 5;

  const content = (
    <Box
      borderColor={borderColorName}
      borderWidth={2}
      borderRadius={borderRadius}
      alignItems="center"
      justifyContent="center"
      shadowColor="bodyText"
      paddingHorizontal="m"
      paddingVertical="m"
      flexDirection="row"
      marginBottom="m"
    >
      <Text style={{...styles.content, color: textColor || buttonColor, fontWeight, fontFamily, fontSize}}>{text}</Text>
      <Box style={{...styles.iconOffset}}>{iconName && <Icon size={12} name={iconName} />}</Box>
    </Box>
  );

  const accessibilityProps = {
    accessibilityRole: 'button' as 'button',
    accessibilityState: {disabled},
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPressHandler}
      style={styles.stretch}
      disabled={disabled}
      testID={testID}
      {...accessibilityProps}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stretch: {
    alignSelf: 'stretch',
  },
  content: {
    textAlign: 'left',
  },
  iconOffset: {
    position: 'absolute',
    right: 15,
  },
});
