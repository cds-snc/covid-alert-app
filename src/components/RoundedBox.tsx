import {Box} from 'components';
import React from 'react';
import {StyleSheet, Platform} from 'react-native';

interface RoundedBoxProp {
  children: React.ReactNode;
  isBoxOne: boolean;
}

export const RoundedBox = ({children, isBoxOne}: RoundedBoxProp) => {
  return (
    <Box
      style={isBoxOne ? styles.roundedBox1 : styles.roundedBox2}
      paddingHorizontal="m"
      paddingVertical="m"
      marginBottom="m"
      marginTop="m"
      alignSelf="stretch"
    >
      {children}
    </Box>
  );
};

const styles = StyleSheet.create({
  roundedBox1: {
    marginTop: Platform.OS === 'ios' ? 5 : 20,
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: -1,
  },
  roundedBox2: {
    borderRadius: 10,
    backgroundColor: 'white',
  },
});
