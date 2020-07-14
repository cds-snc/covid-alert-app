import React, {useState, useCallback, useRef} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import Carousel, {CarouselStatic, CarouselProps} from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/native';
import {Box, Button, ProgressCircles} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';

import {OnboardingContent, onboardingData, OnboardingKey} from './OnboardingContent';

export const OnboardingScreen = () => {
  const navigation = useNavigation();
  const {width: viewportWidth} = useWindowDimensions();
  const carouselRef = useRef<CarouselStatic<OnboardingKey>>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [i18n] = useI18n();
  const {setOnboarded, setOnboardedDatetime, setRegion} = useStorage();
  const startExposureNotificationService = useStartExposureNotificationService();
  const isStart = currentStep === 0;
  const isEnd = currentStep === onboardingData.length - 1;

  const renderItem = useCallback<CarouselProps<OnboardingKey>['renderItem']>(
    ({item, index}) => {
      return (
        <View style={styles.flex} accessibilityElementsHidden={index !== currentStep}>
          <OnboardingContent key={item} item={item} isActive={index === currentStep} />
        </View>
      );
    },
    [currentStep],
  );

  const onSnapToNewPage = (index: number) => {
    // we want the EN permission dialogue to appear on the last step.
    if (index === onboardingData.length - 1) {
      startExposureNotificationService();
    }

    // we want region cleared on the 2nd last step
    if (index === onboardingData.length - 2) {
      setRegion(undefined);
    }
  };

  const nextItem = useCallback(async () => {
    if (isEnd) {
      await setOnboarded(true);
      await setOnboardedDatetime(new Date());
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
            onSnapToItem={newIndex => {
              setCurrentStep(newIndex);
              onSnapToNewPage(newIndex);
            }}
            importantForAccessibility="no"
            accessible={false}
          />
        </View>
        <Box flexDirection="row" borderTopWidth={2} borderTopColor="gray5">
          <Box flex={0} style={{width: 147, right: 10}}>
            {!isStart && <Button text={i18n.translate(`Onboarding.ActionBack`)} variant="text" onPress={prevItem} />}
          </Box>

          <Box flex={2} justifyContent="center" style={{left: 1}}>
            <ProgressCircles numberOfSteps={onboardingData.length} activeStep={currentStep + 1} marginBottom="none" />
          </Box>

          <Box flex={0} style={{width: 147}}>
            <Button
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
  flex: {
    flex: 1,
  },
  dotContainerStyle: {},
  dotWrapperStyle: {
    marginTop: -14,
    fontSize: 20,
  },
});
