import React from 'react';
import {useTheme} from '@shopify/restyle';
import {
  Platform,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
  AccessibilityRole,
} from 'react-native';
import {Theme, palette} from 'shared/theme';
import {useI18n} from '@shopify/react-i18n';

import {Box} from './Box';
import {Icon, IconName} from './Icon';
import {Text} from './Text';
import {Ripple} from './Ripple';

export interface ButtonSingleLineProps {
  text?: string;
  onPress: () => void;
  variant: keyof Theme['buttonVariants'];
  color?: keyof Theme['colors'];
  disabled?: boolean;
  loading?: boolean;
  externalLink?: boolean;
  internalLink?: boolean;
  iconName?: IconName;
}

export const ButtonSingleLine = ({
  text,
  onPress,
  variant,
  color: buttonColorName,
  disabled,
  loading,
  externalLink,
  internalLink,
  iconName,
}: ButtonSingleLineProps) => {
  const [i18n] = useI18n();
  const theme = useTheme<Theme>();
  const variantProps = theme.buttonVariants[variant];
  const disabledProps = disabled ? variantProps.disabled || {} : {};
  const themedStyles = {...variantProps, ...disabledProps};
  const {color, borderWidth, height, borderBottomWidth, borderBottomColor} = (themedStyles as unknown) as TextStyle &
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
      style={{
        backgroundColor: Platform.OS === 'ios' ? color : 'transparent',
        minHeight: height,
        borderWidth,
        borderColor: buttonColor,
        borderBottomWidth,
        borderBottomColor: Platform.OS === 'ios' ? palette.fadedWhiteDark : borderBottomColor,
      }}
      paddingHorizontal="m"
      paddingVertical="m"
      flexDirection="row"
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="large" />
      ) : (
        <Box flexDirection="row-reverse" alignItems="flex-start" justifyContent="flex-start">
          {externalLink && (
            <Box flex={0} style={{...styles.iconOffsetExternal}}>
              <Icon name={externalArrowIcon} size={20} />
            </Box>
          )}
          {internalLink && (
            <Box flex={0} style={{...styles.iconOffsetChevron}}>
              <Icon size={25} name="icon-chevron" />
            </Box>
          )}
          {iconName && (
            <Box flex={0} style={{...styles.iconOffsetChevron}}>
              <Icon size={25} name={iconName} />
            </Box>
          )}
          <Box flex={1} marginLeft="s" alignItems="flex-start" justifyContent="flex-end">
            <Text
              variant="menuItemTitle"
              style={{
                ...styles.content,
                color: textColor || buttonColor,
              }}
            >
              {text}
            </Text>
          </Box>
        </Box>
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
  iconOffsetExternal: {
    marginTop: 2,
    marginLeft: 20,
  },
  iconOffsetChevron: {
    marginTop: -2,
    marginLeft: 20,
  },
  stretch: {
    alignSelf: 'stretch',
  },
  content: {},
  strong: {
    fontWeight: 'bold',
  },
});
