import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import {Box, Header} from 'components';
import {useOrientation} from 'shared/useOrientation';

interface BaseHomeViewProps {
  children?: React.ReactNode;
  animationSource?: string;
}

export const BaseHomeView = ({children, animationSource}: BaseHomeViewProps) => {
  const {
    orientation,
    scaledSize: {width: viewportWidth, height: viewportHeight},
  } = useOrientation();

  return (
    <SafeAreaView style={styles.flex}>
      <Header />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContainer,
          animationSource && orientation === 'portrait' ? styles.scrollContainerWithAnimation : null,
        ]}
        bounces={false}
      >
        {animationSource && orientation === 'portrait' && (
          <Box marginBottom="m">
            <LottieView
              style={{
                ...styles.animationBase,
                width: viewportWidth * 2,
                height: viewportHeight / 2,
              }}
              source={animationSource}
              autoPlay
              loop
            />
          </Box>
        )}
        <Box flex={1} alignItems="center" justifyContent="center" marginHorizontal="xl">
          {children}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContainerWithAnimation: {
    marginTop: -100,
  },
  scrollContainer: {
    minHeight: '90%',
    alignItems: 'center',
  },
  animationBase: {
    marginBottom: -100,
  },
});
