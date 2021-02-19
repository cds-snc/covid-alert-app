import React from 'react';
import {TouchableOpacity, TouchableOpacityProps, StyleSheet} from 'react-native';
import {Box, Icon} from 'components';

interface CloseButtonProps extends TouchableOpacityProps {
  onPress: () => void;
}

export const CloseButton = ({onPress, ...touchableProps}: CloseButtonProps) => (
  <>
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} accessibilityRole="button" {...touchableProps}>
      <Box style={styles.boxPad} backgroundColor="greyCanada25" borderRadius={8}>
        <Box padding="s">
          <Icon name="close" size={20} />
        </Box>
      </Box>
    </TouchableOpacity>
  </>
);

const styles = StyleSheet.create({
  boxPad: {
    padding: 3,
    paddingRight: 15,
  },
});
