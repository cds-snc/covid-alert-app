import React from 'react';
import {Box} from 'components';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export const BaseOnboardingView = ({children}: {children: React.ReactNode}) => {
  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <Box flex={1} paddingTop="s" justifyContent="center">
          {children}
        </Box>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
