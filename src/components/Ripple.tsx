import React from 'react';
import {View, ViewProps} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';

interface RippleProps {
  children: React.ReactNode;
  disabled?: boolean;
  backgroundColor?: string;
  borderRadius?: number;
  onPress: () => void;
}

export const Ripple = ({
  children,
  disabled = false,
  backgroundColor = 'transparent',
  borderRadius = 4,
  onPress,
  ...props
}: RippleProps & ViewProps) => {
  return (
    <RectButton
      enabled={!disabled}
      style={{
        backgroundColor,
        borderRadius,
      }}
      onPress={onPress}
      rippleColor="rgb(0,0,0)"
      activeOpacity={0.8}
    >
      <View accessible {...props}>
        {children}
      </View>
    </RectButton>
  );
};
