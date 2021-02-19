import React from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@shopify/restyle';
import {Theme} from 'shared/theme';

import {Box, BoxProps} from './Box';
import {Ripple} from './Ripple';

export interface ButtonWrapperProps {
  color: keyof Theme['colors'];
  disabled?: boolean;
  borderRadius?: number;
  onPress: () => void;
  testID?: string;
  children?: React.ReactElement;
}

export interface ContentWrapperProps {
  color: string;
  borderRadius?: number;
  children?: React.ReactElement;
}

const ContentWrapper = ({color, borderRadius, children}: ContentWrapperProps) => {
  const boxStyles: BoxProps['style'] = {
    backgroundColor: Platform.OS === 'ios' ? color : 'transparent',
    // minHeight: height,
    // borderBottomWidth,
    // borderBottomColor: Platform.OS === 'ios' ? palette.fadedWhiteDark : borderBottomColor,
  };
  return (
    <Box
      borderRadius={borderRadius}
      alignItems="center"
      justifyContent="center"
      shadowColor="bodyText"
      style={boxStyles}
      paddingHorizontal="m"
      paddingVertical="m"
      flexDirection="row"
    >
      {children}
    </Box>
  );
};

export const ButtonWrapper = ({color, disabled, borderRadius = 8, onPress, testID, children}: ButtonWrapperProps) => {
  const theme = useTheme<Theme>();
  const buttonColor = color && theme.colors[color];
  const content = (
    <ContentWrapper color={buttonColor} borderRadius={borderRadius}>
      {children}
    </ContentWrapper>
  );

  const accessibilityProps = {
    accessibilityRole: 'button' as 'button',
    accessibilityState: {disabled},
  };
  if (Platform.OS === 'android') {
    return (
      <Ripple
        disabled={disabled}
        onPress={onPress}
        backgroundColor={buttonColor}
        borderRadius={borderRadius}
        testID={testID}
        {...accessibilityProps}
      >
        {content}
      </Ripple>
    );
  }
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
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
});
