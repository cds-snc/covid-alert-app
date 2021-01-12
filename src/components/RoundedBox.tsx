import {Box} from 'components';
import React from 'react';
import {StyleSheet, Platform} from 'react-native';

interface RoundedBoxProp {
  children: React.ReactNode;
}

export const RoundedBox = ({children}: RoundedBoxProp) => {
  return (
    <Box
      style={styles.roundedBox}
      backgroundColor="bodyTitleWhite"
      paddingHorizontal="m"
      paddingVertical="m"
      marginBottom="m"
    >
      {children}
    </Box>
  );
};

const styles = StyleSheet.create({
  roundedBox: {
    marginTop: Platform.OS === 'ios' ? 5 : 20,
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: -1,
  },
});
