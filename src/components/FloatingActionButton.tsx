import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

import {Icon, IconName} from './Icon';
import {Box} from './Box';

export interface FABProps {
  text?: string;
  onPress: () => void;
  icon: IconName;
}

export const FloatingActionButton = ({text, onPress, icon}: FABProps) => {
  return (
    <Box marginBottom="xxl" style={styles.touchableOpacityStyle}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <Box alignItems="center" flexDirection="row" justifyContent="center" paddingRight="m" style={styles.boxStyle}>
          <Icon size={40} name={icon} />
          <Text style={styles.textStyle}>{text}</Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  touchableOpacityStyle: {
    flex: 1,
    position: 'absolute',
    right: 10,
    bottom: -15,
  },
  textStyle: {
    textAlign: 'right',
    left: 10,
  },
  boxStyle: {
    borderRadius: 10,
    backgroundColor: '#F4B500',
  },
});
