import React, {useState, useCallback, useRef} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import Carousel, {CarouselStatic, CarouselProps} from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/native';
import {Box, Button, Toolbar, ProgressCircles} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from 'locale';

import {TutorialContent, tutorialData, TutorialKey} from './TutorialContent';

export const TutorialScreen = () => {
  const navigation = useNavigation();
  const {width: viewportWidth} = useWindowDimensions();
  const carouselRef = useRef<CarouselStatic<TutorialKey>>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const i18n = useI18n();
  const close = useCallback(() => navigation.goBack(), [navigation]);

  const isStart = currentStep === 0;
  const isEnd = currentStep === tutorialData.length - 1;

  const renderItem = useCallback<CarouselProps<TutorialKey>['renderItem']>(
    ({item, index}) => {
      return (
        <View style={styles.flex} accessibilityElementsHidden={index !== currentStep}>
          <TutorialContent key={item} item={item} isActive={index === currentStep} />
        </View>
      );
    },
    [currentStep],
  );

  const nextItem = useCallback(() => {
    if (isEnd) {
      close();
      return;
    }
    carouselRef.current?.snapToNext();
  }, [close, isEnd]);

  const prevItem = useCallback(() => {
    carouselRef.current?.snapToPrev();
  }, []);

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('Tutorial.Close')}
          navLabel={i18n.translate('Tutorial.Close')}
          onIconClicked={close}
        />
        <View style={styles.flex}>
          <Carousel
            ref={carouselRef as any}
            data={tutorialData}
            renderItem={renderItem}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
            onSnapToItem={newIndex => setCurrentStep(newIndex)}
            importantForAccessibility="no"
            accessible={false}
          />
        </View>
        <Box flexDirection="row" borderTopWidth={2} borderTopColor="gray5">
          <Box flex={0} style={{width: 147, right: 10}}>
            {!isStart && <Button text={i18n.translate(`Tutorial.ActionBack`)} variant="text" onPress={prevItem} />}
          </Box>

          <Box flex={2} justifyContent="center" style={{left: 1}}>
            <ProgressCircles numberOfSteps={tutorialData.length} activeStep={currentStep + 1} marginBottom="none" />
          </Box>

          <Box flex={0} style={{width: 147}}>
            <Button
              text={i18n.translate(`Tutorial.Action${isEnd ? 'End' : 'Next'}`)}
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
