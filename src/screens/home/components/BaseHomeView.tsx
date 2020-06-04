import React, {useRef, useEffect} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import {useReduceMotionPreference} from 'shared/useReduceMotionPreference';
import {Box, Header} from 'components';
import {useOrientation} from 'shared/useOrientation';

interface BaseHomeViewProps {
  children?: React.ReactNode;
  animationSource?: string;
  animationPauseFrame?: number;
}

export const BaseHomeView = ({children, animationSource, animationPauseFrame}: BaseHomeViewProps) => {
  const {
    orientation,
    scaledSize: {width: viewportWidth, height: viewportHeight},
  } = useOrientation();
  const prefersReducedMotion = useReduceMotionPreference();
  const animationRef: React.Ref<LottieView> = useRef(null);

  useEffect(() => {
    // need to stop if user prefers reduced animations
    if (prefersReducedMotion) {
      if (animationPauseFrame) {
        animationRef.current?.play(animationPauseFrame, animationPauseFrame);
      } else {
        animationRef.current?.reset();
        animationRef.current?.pause();
      }
    }
  }, [prefersReducedMotion, animationPauseFrame]);

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
              ref={animationRef}
              style={{
                ...styles.animationBase,
                width: viewportWidth * 2,
                height: viewportHeight / 2,
              }}
              source={animationSource}
              // don't play if user prefers reduced animations
              autoPlay={!prefersReducedMotion}
              loop={!prefersReducedMotion}
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
