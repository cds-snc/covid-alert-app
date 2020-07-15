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
import {useI18n} from 'locale';

import {Box} from './Box';
import {Icon} from './Icon';
import {Ripple} from './Ripple';

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
  const i18n = useI18n();
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
  const borderRadius = 10;
  const content = (
    <Box
      borderRadius={borderRadius}
      alignItems="center"
      justifyContent="center"
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        backgroundColor: Platform.OS === 'ios' ? color : 'transparent',
        minHeight: height,
        borderWidth,
        borderColor: buttonColor,
      }}
      paddingHorizontal="m"
      paddingVertical="m"
      flexDirection="row"
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="large" />
      ) : (
        <>
          <Box
            flex={1}
            flexBasis="100%"
            flexDirection="row-reverse"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Box flexBasis={25} style={{...styles.iconOffset}}>
              {externalLink && <Icon name={externalArrowIcon} size={25} />}
              {internalLink && <Icon name="icon-chevron-white" size={25} />}
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
      <Ripple
        disabled={disabled}
        onPress={onPressHandler}
        backgroundColor={color}
        borderRadius={borderRadius}
        {...accessibilityProps}
      >
        {content}
      </Ripple>
    );
  }
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPressHandler}
      style={styles.stretch}
      disabled={disabled}
      {...accessibilityProps}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconOffset: {
    marginTop: 0,
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
