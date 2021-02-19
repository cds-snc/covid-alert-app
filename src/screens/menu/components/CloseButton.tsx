import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {Box, Icon} from 'components';

interface CloseButtonProps extends TouchableOpacityProps {
  onPress: () => void;
}

export const CloseButton = ({onPress, ...touchableProps}: CloseButtonProps) => (
  <TouchableOpacity activeOpacity={0.6} onPress={onPress} accessibilityRole="button" {...touchableProps}>
    <Box backgroundColor="greyCanada25" borderRadius={8}>
      <Box padding="m">
        <Icon name="close" size={20} />
      </Box>
    </Box>
  </TouchableOpacity>
);
