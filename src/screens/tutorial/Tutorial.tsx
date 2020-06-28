import React, {useState, useCallback, useRef} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import Carousel, {CarouselStatic, Pagination} from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/native';
import {Box, Button, Toolbar, Text} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from '@shopify/react-i18n';

import {TutorialContent, tutorialData, TutorialKey} from './TutorialContent';

export const TutorialScreen = () => {
  const navigation = useNavigation();
  const {width: viewportWidth} = useWindowDimensions();
  const carouselRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [i18n] = useI18n();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const [carouselVisible, setCarousalVisible] = useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCarousalVisible(true);
    });

    return unsubscribe;
  }, [navigation]);

  const isStart = currentStep === 0;
  const isEnd = currentStep === tutorialData.length - 1;

  const renderItem = useCallback(
    ({item}: {item: TutorialKey}) => {
      return (
        <TutorialContent
          item={item}
          currentIndex={currentStep + 1}
          isActiveSlide={tutorialData[currentStep] === item}
        />
      );
    },
    [currentStep],
  );

  const nextItem = useCallback(() => {
    if (carouselRef.current) {
      if (isEnd) {
        close();
        return;
      }
      (carouselRef.current! as CarouselStatic<TutorialKey>).snapToNext();
    }
  }, [close, isEnd]);

  const prevItem = useCallback(() => {
    if (carouselRef.current) {
      (carouselRef.current! as CarouselStatic<TutorialKey>).snapToPrev();
    }
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
        {carouselVisible && (
          <Carousel
            ref={carouselRef}
            data={tutorialData}
            renderItem={renderItem}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
            onSnapToItem={newIndex => setCurrentStep(newIndex)}
          />
        )}
        <Box flexDirection="row" borderTopWidth={2} borderTopColor="gray5">
          <Box flex={1}>
            {!isStart && (
              <Button text={i18n.translate(`Tutorial.ActionBack`)} variant="subduedText" onPress={prevItem} />
            )}
          </Box>

          <Pagination
            dotContainerStyle={styles.dotContainerStyle}
            activeDotIndex={currentStep + 1}
            dotsLength={tutorialData.length}
            renderDots={(activeIndex, total) => {
              const stepText = i18n.translate('Onboarding.Step');
              const ofText = i18n.translate('Onboarding.Of');
              const text = `${stepText} ${activeIndex} ${ofText} ${total}`;
              return (
                <Box style={styles.dotWrapperStyle}>
                  <Text color="gray2" variant="bodyText">
                    {text}
                  </Text>
                </Box>
              );
            }}
          />

          <Box flex={1}>
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
