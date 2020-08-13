import React, {useState, useCallback, useRef} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import Carousel, {CarouselStatic, CarouselProps} from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/native';
import {Box, Button, ProgressCircles} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from 'locale';
import {useStorage} from 'services/StorageService';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';
import {getCurrentDate} from 'shared/date-fns';
import {useAccessibilityService} from 'services/AccessibilityService';

import {OnboardingContent, onboardingData, OnboardingKey} from './OnboardingContent';

export const OnboardingScreen = () => {
  const navigation = useNavigation();
  const {width: viewportWidth} = useWindowDimensions();
  const carouselRef = useRef<CarouselStatic<OnboardingKey>>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const i18n = useI18n();
  const {setOnboarded, setOnboardedDatetime, setRegion} = useStorage();
  const startExposureNotificationService = useStartExposureNotificationService();
  const isStart = currentStep === 0;
  const isEnd = currentStep === onboardingData.length - 1;
  const {isScreenReaderEnabled} = useAccessibilityService();
  const currentStepForRenderItem = isScreenReaderEnabled ? currentStep : -1;

  const renderItem = useCallback<CarouselProps<OnboardingKey>['renderItem']>(
    ({item, index}) => {
      return (
        <View style={styles.flex} accessibilityElementsHidden={index !== currentStepForRenderItem}>
          <OnboardingContent key={item} item={item} isActive={index === currentStepForRenderItem} />
        </View>
      );
    },
    [currentStepForRenderItem],
  );

  const onSnapToNewPage = useCallback(
    (index: number) => {
      // we want the EN permission dialogue to appear on the last step.
      if (index === onboardingData.length - 1) {
        startExposureNotificationService();
      }

      // we want region cleared on the 2nd last step
      if (index === onboardingData.length - 2) {
        setRegion(undefined);
      }
    },
    [setRegion, startExposureNotificationService],
  );

  const nextItem = useCallback(async () => {
    if (isEnd) {
      await setOnboarded(true);
      await setOnboardedDatetime(getCurrentDate());
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
      return;
    }
    carouselRef.current?.snapToNext();
  }, [isEnd, navigation, setOnboarded, setOnboardedDatetime]);

  const prevItem = useCallback(() => {
    carouselRef.current?.snapToPrev();
  }, []);

  const onSnapToItem = useCallback(
    (newIndex: number) => {
      setCurrentStep(newIndex);
      onSnapToNewPage(newIndex);
    },
    [onSnapToNewPage],
  );

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.flex}>
          <Carousel
            ref={carouselRef as any}
            data={onboardingData}
            renderItem={renderItem}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
            onSnapToItem={onSnapToItem}
            importantForAccessibility="no"
            accessible={false}
            initialNumToRender={1}
          />
        </View>
        <Box flexDirection="row" borderTopWidth={2} borderTopColor="gray5">
          <Box flex={0} style={{...styles.offset1}}>
            {!isStart && <Button text={i18n.translate(`Onboarding.ActionBack`)} variant="text" onPress={prevItem} />}
          </Box>

          <Box flex={2} justifyContent="center" style={{...styles.offset2}}>
            <ProgressCircles numberOfSteps={onboardingData.length} activeStep={currentStep + 1} marginBottom="none" />
          </Box>

          <Box flex={0} style={{...styles.offset3}}>
            <Button
              testID="onboardingNextButton"
              text={i18n.translate(`Onboarding.Action${isEnd ? 'End' : 'Next'}`)}
              variant="text"
              onPress={nextItem}
            />
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  offset1: {
    width: 147,
    right: 10,
  },
  offset2: {
    left: 1,
  },
  offset3: {
    width: 147,
  },
  flex: {
    flex: 1,
  },
  dotContainerStyle: {},
  dotWrapperStyle: {
    marginTop: -14,
    fontSize: 20,
  },
});
