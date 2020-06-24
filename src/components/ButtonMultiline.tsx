import React from 'react';
import {useTheme} from '@shopify/restyle';
import {
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
  AccessibilityRole,
} from 'react-native';
import {Theme, palette} from 'shared/theme';
import {useI18n} from '@shopify/react-i18n';

import {Box} from './Box';
import {Ripple} from './Ripple';
import {Icon} from './Icon';

export interface ButtonMultilineProps {
  text?: string;
  text1?: string;
  onPress: () => void;
  variant: keyof Theme['buttonVariants'];
  color?: keyof Theme['colors'];
  disabled?: boolean;
  loading?: boolean;
  externalLink?: boolean;
  internalLink?: boolean;
}

export const ButtonMultiline = ({
  text,
  text1,
  onPress,
  variant,
  color: buttonColorName,
  disabled,
  loading,
  externalLink,
  internalLink,
}: ButtonMultilineProps) => {
  const [i18n] = useI18n();
  const theme = useTheme<Theme>();
  const variantProps = theme.buttonVariants[variant];
  const disabledProps = disabled ? variantProps.disabled || {} : {};
  const themedStyles = {...variantProps, ...disabledProps};
  const {fontSize, fontWeight, fontFamily, color, borderWidth, height} = (themedStyles as unknown) as TextStyle &
    ViewStyle;
  const textColor = themedStyles.textColor;
  const buttonColor = buttonColorName && theme.colors[buttonColorName];

  const onPressHandler = loading ? () => {} : onPress;
  const externalLinkProps = externalLink
    ? {
        accessibilityLabel: text,
        accessibilityHint: i18n.translate('Home.ExternalLinkHint'),
        accessibilityRole: 'link' as AccessibilityRole,
      }
    : {};
  const externalArrowIcon = textColor === palette.white ? 'icon-external-arrow-light' : 'icon-external-arrow';

  const content = (
    <Box
      borderRadius={10}
      alignItems="center"
      justifyContent="center"
      style={{backgroundColor: color, minHeight: height, borderWidth, borderColor: buttonColor}}
      paddingHorizontal="m"
      paddingVertical="m"
      flexDirection="row"
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="large" />
      ) : (
        <>
          <Box flex={1} flexDirection="row-reverse" alignItems="flex-start" justifyContent="flex-start">
            <Box flex={1} flexBasis="10%" style={{...styles.iconOffset}}>
              {externalLink && <Icon name={externalArrowIcon} size={50} />}
              {internalLink && <Icon name="icon-chevron-white" size={50} />}
            </Box>

            <Box flex={1} flexBasis="90%" alignItems="flex-start" justifyContent="flex-end">
              <Text
                style={{
                  ...styles.content,
                  color: textColor || buttonColor,
                  fontFamily,
                  fontSize,
                  ...styles.strong,
                }}
              >
                {text}
              </Text>
              <Text style={{...styles.content, color: textColor || buttonColor, fontWeight, fontFamily, fontSize}}>
                {text1}
              </Text>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );

  const accessibilityProps = {
    accessibilityRole: 'button' as 'button',
    accessibilityState: {disabled},
    ...externalLinkProps,
  };

  if (Platform.OS === 'android') {
    return (
      <Ripple rippleContainerBorderRadius={4} onPress={onPressHandler} {...accessibilityProps}>
        {content}
      </Ripple>
    );
  }
  return (
    <TouchableOpacity onPress={onPressHandler} style={styles.stretch} disabled={disabled} {...accessibilityProps}>
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconOffset: {
    marginTop: -10,
  },
  strong: {
    fontWeight: 'bold',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  content: {
    textAlign: 'left',
    marginLeft: 10,
  },
});
