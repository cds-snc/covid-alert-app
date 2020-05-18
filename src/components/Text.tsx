import React, {ReactNode} from 'react';
import {createText} from '@shopify/restyle';
import {Text as RNText, TextProps as RNTextProps} from 'react-native';
import {Theme} from 'shared/theme';

// Wrap text to set the correct font family based on weight on Android
const _Text = ({style, ...rest}: RNTextProps & {children?: ReactNode}) => {
  // const {fontFamily, fontWeight} = StyleSheet.flatten(style);
  return <RNText style={[style]} {...rest} />;
};

export const Text = createText<Theme>(_Text);
export type TextProps = React.ComponentProps<typeof Text>;

Text.defaultProps = {
  variant: 'bodyText',
  color: 'bodyText',
};
