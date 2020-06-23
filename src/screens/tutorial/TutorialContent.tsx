import React, {useRef, useEffect} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';
import LottieView from 'lottie-react-native';
import {useReduceMotionPreference} from 'shared/useReduceMotionPreference';

export type TutorialKey = 'step-1' | 'step-2' | 'step-3' | 'step-4' | 'step-5' | 'step-6';

export const tutorialData: TutorialKey[] = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6'];

const animationData = {
  'step-1': {
    source: '',
    pauseFrame: 0,
  },
  'step-2': {
    source: '',
    pauseFrame: 378,
  },
  'step-3': {
    source: '',
    pauseFrame: 398,
  },
  'step-4': {
    source: '',
    pauseFrame: 418,
  },
  'step-5': {
    source: '',
    pauseFrame: 438,
  },
  'step-6': {
    source: '',
    pauseFrame: 458,
  },
};

export const TutorialContent = ({item, isActiveSlide}: {item: TutorialKey; isActiveSlide: boolean}) => {
  const [i18n] = useI18n();
  const prefersReducedMotion = useReduceMotionPreference();
  // const {width: viewportWidth, height: viewportHeight} = useWindowDimensions();
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

  const itemTitle = i18n.translate(`Tutorial.${item}Title`);
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.center}>
      <Box marginTop="l">{/* image goes here */}</Box>
      <Box flex={1} paddingVertical="xxl" paddingHorizontal="xxl">
        {itemTitle !== '' && (
          <Text marginTop="xxl" color="overlayBodyText" variant="bodyTitle" marginBottom="m" accessibilityRole="header">
            {itemTitle}
          </Text>
        )}
        <Text variant="bodyText" color="overlayBodyText">
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
