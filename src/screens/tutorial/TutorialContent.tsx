import React, {useRef, useEffect} from 'react';
import {Dimensions, StyleSheet, ScrollView} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';
import LottieView from 'lottie-react-native';
import {useReduceMotionPreference} from 'shared/useReduceMotionPreference';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

export type TutorialKey = 'step-1' | 'step-2' | 'step-3';

export const tutorialData: TutorialKey[] = ['step-1', 'step-2', 'step-3'];

const animationData = {
  'step-1': {
    source: require('assets/animation/onboarding-step-1.json'),
    pauseFrame: 105,
  },
  'step-2': {
    source: require('assets/animation/onboarding-step-2.json'),
    pauseFrame: 120,
  },
  'step-3': {
    source: require('assets/animation/onboarding-step-3.json'),
    pauseFrame: 124,
  },
};

export const TutorialContent = ({item, isActiveSlide}: {item: TutorialKey; isActiveSlide: boolean}) => {
  const [i18n] = useI18n();
  const prefersReducedMotion = useReduceMotionPreference();
  const animationRef: React.Ref<LottieView> = useRef(null);
  useEffect(() => {
    // need to stop if user prefers reduced animations
    if (prefersReducedMotion) {
      animationRef.current?.play(animationData[item].pauseFrame, animationData[item].pauseFrame);
    } else if (isActiveSlide) {
      animationRef.current?.play();
    } else {
      animationRef.current?.reset();
    }
  }, [isActiveSlide, prefersReducedMotion, item]);
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.center}>
      <LottieView
        ref={animationRef}
        style={{width: viewportWidth, height: viewportHeight / 2}}
        source={animationData[item].source}
        imageAssetsFolder="animation/images"
        loop={!prefersReducedMotion}
      />
      <Box paddingHorizontal="xxl">
        <Text textAlign="center" color="overlayBodyText" variant="bodySubTitle" marginBottom="m">
          {i18n.translate(`Tutorial.${item}Title`)}
        </Text>
        <Text variant="bodyText" textAlign="center" color="overlayBodyText">
          {i18n.translate(`Tutorial.${item}`)}
        </Text>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
  },
});
