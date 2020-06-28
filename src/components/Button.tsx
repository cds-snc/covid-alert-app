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

export interface ButtonProps {
  text?: string;
  onPress: () => void;
  variant: keyof Theme['buttonVariants'];
  color?: keyof Theme['colors'];
  disabled?: boolean;
  loading?: boolean;
  externalLink?: boolean;
  internalLink?: boolean;
  backButton?: boolean;
}

export const Button = ({
  text,
  onPress,
  variant,
  color: buttonColorName,
  disabled,
  loading,
  externalLink,
  internalLink,
  backButton,
}: ButtonProps) => {
  const [i18n] = useI18n();
  const theme = useTheme<Theme>();
  const variantProps = theme.buttonVariants[variant];
  const disabledProps = disabled ? variantProps.disabled || {} : {};
  const themedStyles = {...variantProps, ...disabledProps};
  const {fontSize, fontWeight, fontFamily, color, borderBottomWidth, height} = (themedStyles as unknown) as TextStyle &
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
      borderRadius={5}
      alignItems="center"
      justifyContent="center"
      shadowColor="bodyText"
      style={{backgroundColor: color, minHeight: height, borderBottomWidth, borderBottomColor: palette.fadedWhiteDark}}
      paddingHorizontal="m"
      paddingVertical="m"
      flexDirection="row"
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="large" />
      ) : (
        <>
          {backButton && (
            <Box style={styles.backIcon} marginRight="s">
              <Icon size={14} name="icon-chevron-back" />
            </Box>
          )}
          <Text style={{...styles.content, color: textColor || buttonColor, fontWeight, fontFamily, fontSize}}>
            {text}
          </Text>
          <Box style={{...styles.chevronOffset}}>
            {externalLink && <Icon name={externalArrowIcon} />}
            {internalLink && <Icon size={25} name="icon-chevron" />}
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
      <Ripple rippleContainerBorderRadius={5} onPress={onPressHandler} {...accessibilityProps}>
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
  stretch: {
    alignSelf: 'stretch',
  },
  content: {
    textAlign: 'left',
  },
  chevronOffset: {
    position: 'absolute',
    right: 15,
  },
  backIcon: {
    marginTop: 1,
  },
});
