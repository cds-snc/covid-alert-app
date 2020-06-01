import React, {useRef, useEffect} from 'react';
import {StyleSheet, Dimensions, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import {useReduceMotionPreference} from 'shared/useReduceMotionPreference';
import {Box, Header} from 'components';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

interface BaseHomeViewProps {
  children?: React.ReactNode;
  animationSource?: string;
}

export const BaseHomeView = ({children, animationSource}: BaseHomeViewProps) => {
  const prefersReducedMotion = useReduceMotionPreference();
  const animationRef: React.Ref<LottieView> = useRef(null);

  useEffect(() => {
    // need to stop if user prefers reduced animations
    if (prefersReducedMotion) {
      animationRef.current?.reset();
      animationRef.current?.pause();
    }
  }, [prefersReducedMotion]);

  return (
    <SafeAreaView style={styles.flex}>
      <Header />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.scrollContainer, animationSource ? styles.scrollContainerWithAnimation : null]}
        bounces={false}
      >
        {animationSource && (
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
