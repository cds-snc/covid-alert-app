import React, {useRef, useEffect} from 'react';
import {StyleSheet, ScrollView, useWindowDimensions} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';
import LottieView from 'lottie-react-native';

export type TutorialKey = 'step-1' | 'step-2' | 'step-3';

export const tutorialData: TutorialKey[] = ['step-1', 'step-2', 'step-3'];

const animationData = {
  'step-1': require('assets/animation/onboarding-step-1.json'),
  'step-2': require('assets/animation/onboarding-step-2.json'),
  'step-3': require('assets/animation/onboarding-step-3.json'),
};

export const TutorialContent = ({item, isActiveSlide}: {item: TutorialKey; isActiveSlide: boolean}) => {
  const [i18n] = useI18n();
  const {width: viewportWidth, height: viewportHeight} = useWindowDimensions();
  const animationRef: React.Ref<LottieView> = useRef(null);
  useEffect(() => {
    if (isActiveSlide) {
      animationRef.current?.play();
    } else {
      animationRef.current?.reset();
    }
  }, [isActiveSlide]);
  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.center}>
      <LottieView
        ref={animationRef}
        style={{width: viewportWidth, height: viewportHeight / 2}}
        source={animationData[item]}
        imageAssetsFolder="animation/images"
        loop
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
