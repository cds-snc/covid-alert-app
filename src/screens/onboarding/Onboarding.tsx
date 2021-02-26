import React, {useState, useCallback, useRef} from 'react';
import {ListRenderItem, StyleSheet, useWindowDimensions, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/native';
import {Box, Button, ProgressCircles} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from 'locale';
import {useStorage} from 'services/StorageService';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';
import {getCurrentDate} from 'shared/date-fns';
import {useAccessibilityService} from 'services/AccessibilityService';
import {FilteredMetricsService} from 'services/MetricsService/FilteredMetricsService';
import {EventTypeMetric} from 'services/MetricsService/MetricsFilter';

import {OnboardingContent, onboardingData, OnboardingKey} from './OnboardingContent';

export const OnboardingScreen = () => {
  const navigation = useNavigation();
  const {width: viewportWidth} = useWindowDimensions();
  const carouselRef = useRef<Carousel<OnboardingKey>>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const i18n = useI18n();
  const {setOnboarded, setOnboardedDatetime, setRegion} = useStorage();
  const startExposureNotificationService = useStartExposureNotificationService();
  const isStart = currentStep === 0;
  const isEnd = currentStep === onboardingData.length - 1;
  const {isScreenReaderEnabled} = useAccessibilityService();
  const currentStepForRenderItem = isScreenReaderEnabled ? currentStep : -1;

  const renderItem: ListRenderItem<OnboardingKey> = useCallback(
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
    async (index: number) => {
      // we want the EN permission dialogue to appear on the last step.
      if (index === onboardingData.length - 1) {
        const start = await startExposureNotificationService();
        if (typeof start !== 'boolean' && start?.error === 'API_NOT_CONNECTED') {
          navigation.reset({
            index: 0,
            routes: [{name: 'ErrorScreen'}],
          });
        }
      }

      // we want region cleared on the 2nd last step
      if (index === onboardingData.length - 2) {
        setRegion(undefined);
      }
    },
    [navigation, setRegion, startExposureNotificationService],
  );

  const nextItem = useCallback(async () => {
    if (isEnd) {
      await setOnboarded(true);
      FilteredMetricsService.sharedInstance().addEvent({type: EventTypeMetric.Onboarded});
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
            ref={carouselRef}
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
