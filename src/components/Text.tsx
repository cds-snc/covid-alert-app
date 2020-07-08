import React, {forwardRef} from 'react';
import {TextProps as RestyleTextProps, textRestyleFunctions, useRestyle} from '@shopify/restyle';
import {Text as RNText} from 'react-native';
import {Theme} from 'shared/theme';

// See https://github.com/Shopify/restyle/blob/master/src/createText.ts
export type TextProps = RestyleTextProps<Theme> &
  Omit<React.ComponentProps<typeof RNText> & {children?: React.ReactNode}, keyof RestyleTextProps<Theme>>;

const BaseText = (props: TextProps, ref?: React.LegacyRef<any>) => {
  const styledProps = useRestyle(textRestyleFunctions, props);
  return <RNText {...styledProps} ref={ref} />;
};

export const Text = forwardRef(BaseText);

Text.defaultProps = {
  variant: 'bodyText',
  color: 'bodyText',
};
