import React from 'react';
import {Platform, TouchableOpacity} from 'react-native';

import {Box} from './Box';
import {Icon, IconProps} from './Icon';
import {Ripple} from './Ripple';

interface TouchableIconProps {
  iconName: IconProps['name'];
  iconSize?: IconProps['size'];
  containerSize?: number;
  label?: string;
  onPress(): void;
}

export const TouchableIcon = ({iconName, iconSize, containerSize = 56, label, onPress}: TouchableIconProps) => {
  const accessibilityProps = {
    accessibilityRole: 'button' as 'button',
    accessibilityLabel: label,
  };

  const content = (
    <Box width={containerSize} height={containerSize} justifyContent="center" alignItems="center">
      <Icon name={iconName} size={iconSize} />
    </Box>
  );

  if (Platform.OS === 'android') {
    return (
      <Ripple
        rippleSize={containerSize}
        rippleContainerBorderRadius={containerSize}
        rippleCentered
        onPress={onPress}
        {...accessibilityProps}
      >
        {content}
      </Ripple>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} {...accessibilityProps}>
      {content}
    </TouchableOpacity>
  );
};
