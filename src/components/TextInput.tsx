import React from 'react';
import {
  useRestyle,
  ColorProps,
  LayoutProps,
  layout,
  color,
  SpacingProps,
  TypographyProps,
  spacing,
  typography,
  BackgroundColorProps,
  backgroundColor,
} from '@shopify/restyle';
import {TextInput as RNTextInput, TextInputProps as RNTextInputProps} from 'react-native';
import {Theme} from 'shared/theme';

export type TextInputProps = RNTextInputProps &
  BackgroundColorProps<Theme> &
  ColorProps<Theme> &
  LayoutProps<Theme> &
  SpacingProps<Theme> &
  TypographyProps<Theme>;

const textInputRestyleFunctions = [backgroundColor, color, layout, spacing, typography];

export const TextInput = (props: TextInputProps) => {
  const styledProps = useRestyle(textInputRestyleFunctions, props);
  return <RNTextInput accessible {...styledProps} />;
};
