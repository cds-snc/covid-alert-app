import React from 'react';
import {TextProps as RestyleTextProps, textRestyleFunctions, useRestyle} from '@shopify/restyle';
import {Text as RNText} from 'react-native';
import {Theme} from 'shared/theme';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

// See https://github.com/Shopify/restyle/blob/master/src/createText.ts
export type TextProps = RestyleTextProps<Theme> &
  Omit<React.ComponentProps<typeof RNText> & {children?: React.ReactNode}, keyof RestyleTextProps<Theme>> & {
    accessibilityAutoFocus?: boolean;
    focusRef?: React.LegacyRef<any>;
  };

export const Text = ({accessibilityAutoFocus = false, focusRef, ...props}: TextProps) => {
  const styledProps = useRestyle(textRestyleFunctions, props);
  const autoFocusRef = useAccessibilityAutoFocus(accessibilityAutoFocus);
  return <RNText accessible ref={focusRef ? focusRef : autoFocusRef} {...styledProps} />;
};

Text.defaultProps = {
  variant: 'bodyText',
  color: 'bodyText',
};
