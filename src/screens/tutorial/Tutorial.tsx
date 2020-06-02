import React, {useState, useCallback, useRef} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import Carousel, {CarouselStatic} from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/native';
import {Box, Button, ProgressCircles, Toolbar} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from '@shopify/react-i18n';

import {TutorialContent, tutorialData, TutorialKey} from './TutorialContent';

const {width: viewportWidth} = Dimensions.get('window');

export const TutorialScreen = () => {
  const navigation = useNavigation();
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
      return <TutorialContent item={item} isActiveSlide={tutorialData[currentStep] === item} />;
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
        <Box alignItems="center" justifyContent="center" flexDirection="row" flexWrap="wrap">
          <Box flex={1} padding="l" flexWrap="wrap">
            {!isStart && (
              <Button text={i18n.translate(`Tutorial.ActionBack`)} variant="subduedText" onPress={prevItem} />
            )}
          </Box>
          <ProgressCircles numberOfSteps={tutorialData.length} activeStep={currentStep + 1} marginBottom="none" />
          <Box flex={1} padding="l" flexWrap="wrap">
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
  animationBase: {
    position: 'absolute',
    top: 0,
  },
});
