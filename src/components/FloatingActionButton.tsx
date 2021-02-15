import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';

import {Icon, IconName} from './Icon';
import {Box} from './Box';

export interface FABProps {
  text?: string;
  onPress: () => void;
  icon: IconName;
}

export const FloatingActionButton = ({text, onPress, icon}: FABProps) => {
  return (
    <TouchableOpacity style={styles.touchableOpacityStyle} activeOpacity={0.7} onPress={onPress}>
      <Box
        alignItems="center"
        flexDirection="row"
        justifyContent="center"
        marginBottom="xxl"
        paddingRight="m"
        style={styles.boxStyle}
      >
        <Icon size={40} name={icon} />
        <Text style={styles.textStyle}>{text}</Text>
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableOpacityStyle: {
    flex: 1,
    position: 'absolute',
    right: 10,
    bottom: 90,
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
