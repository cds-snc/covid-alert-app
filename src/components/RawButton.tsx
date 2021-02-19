import React from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {Theme} from 'shared/theme';
import { Box } from './Box';

import {Ripple} from './Ripple';

export interface RawButtonProps {
  color?: keyof Theme['colors'];
  disabled?: boolean;
  borderRadius?: number;
  onPress: () => void;
  testID?: string;
  children?: React.ReactElement;
}

export interface ContentWrapperProps {
  children?: React.ReactElement;
}


const ContentWrapper = ({children}: ContentWrapperProps) => {
  const boxStyles: BoxProps['style'] = {
    backgroundColor: Platform.OS === 'ios' ? color : 'transparent',
    minHeight: height,
    borderBottomWidth,
    borderBottomColor: Platform.OS === 'ios' ? palette.fadedWhiteDark : borderBottomColor,
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
    >;
  );
};

export const RawButton = ({color, disabled, borderRadius, onPress, testID, children}: RawButtonProps) => {

  const accessibilityProps = {
    accessibilityRole: 'button' as 'button',
    accessibilityState: {disabled},
  };
  if (Platform.OS === 'android') {
    return (
      <Ripple
        disabled={disabled}
        onPress={onPress}
        backgroundColor={color}
        borderRadius={borderRadius}
        testID={testID}
        {...accessibilityProps}
      >
        {children}
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
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stretch: {
    alignSelf: 'stretch',
  },
});
