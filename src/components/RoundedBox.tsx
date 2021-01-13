import {Box} from 'components';
import React from 'react';
import {StyleSheet, Platform} from 'react-native';

interface RoundedBoxProp {
  children: React.ReactNode;
  isFirstBox: boolean;
}

export const RoundedBox = ({children, isFirstBox}: RoundedBoxProp) => {
  return (
    <Box
      style={isFirstBox ? [styles.roundedBox, styles.firstBox] : styles.roundedBox}
      marginBottom="m"
      marginTop="m"
      alignSelf="stretch"
    >
      <Box paddingHorizontal="m" paddingVertical="m">
        {children}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  roundedBox: {
    borderRadius: 10,
    backgroundColor: 'white',
  },
  firstBox: {
    marginTop: Platform.OS === 'ios' ? 5 : 20,
    zIndex: -1,
  },
});
