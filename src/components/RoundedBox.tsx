import {Box} from 'components';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Theme} from 'shared/theme';

interface RoundedBoxProp {
  children: React.ReactNode;
  isFirstBox: boolean;
  backgroundColor?: keyof Theme['colors'];
}

export const RoundedBox = ({children, isFirstBox, backgroundColor = 'bodyTitleWhite'}: RoundedBoxProp) => {
  return (
    <Box
      style={isFirstBox ? [styles.roundedBox, styles.firstBox] : styles.roundedBox}
      marginBottom="m"
      alignSelf="stretch"
      backgroundColor={backgroundColor}
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
  },
  firstBox: {
    marginTop: -30,
    paddingTop: 30,
    zIndex: -1,
  },
});
