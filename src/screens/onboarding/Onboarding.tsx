import React, {useCallback, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Button, ProgressCircles, Header, LanguageToggle} from 'components';
import {StyleSheet, LayoutChangeEvent, LayoutRectangle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Carousel, {CarouselStatic} from 'react-native-snap-carousel';
import {useI18n} from '@shopify/react-i18n';
import {useMaxContentWidth} from 'shared/useMaxContentWidth';

import {Permissions} from './views/Permissions';
import {Start} from './views/Start';
import {YourData} from './views/YourData';

type ViewKey = 'start' | 'permissions' | 'yourdata';

const contentData: ViewKey[] = ['start', 'permissions', 'yourdata'];
const viewComponents = {
  start: Start,
  permissions: Permissions,
  yourdata: YourData,
};

export const OnboardingScreen = () => {
  const [i18n] = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const navigation = useNavigation();

  const maxWidth = useMaxContentWidth();

  const renderItem = useCallback(
    ({item}: {item: ViewKey}) => {
      const ItemComponent = viewComponents[item];
      return (
        <Box maxWidth={maxWidth} alignSelf="center">
          <ItemComponent />
        </Box>
      );
    },
    [maxWidth],
  );

  const nextItem = useCallback(() => {
    if (carouselRef.current) {
      if (currentIndex === contentData.length - 1) {
        navigation.navigate('RegionPicker');
        return;
      }
      (carouselRef.current! as CarouselStatic<ViewKey>).snapToNext();
    }
  }, [currentIndex, navigation]);

  const prevItem = useCallback(() => {
    if (carouselRef.current) {
      (carouselRef.current! as CarouselStatic<ViewKey>).snapToPrev();
    }
  }, []);

  const isStart = currentIndex === 0;
  const isEnd = currentIndex === contentData.length - 1;

  const BackButton = <Button text={i18n.translate('Onboarding.ActionBack')} variant="subduedText" onPress={prevItem} />;
  const LanguageButton = <LanguageToggle />;

  const [layout, setLayout] = useState<LayoutRectangle | undefined>();
  const onLayout = useCallback(({nativeEvent: {layout}}: LayoutChangeEvent) => {
    setLayout(layout);
  }, []);

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <Header />
        <Box flex={1} justifyContent="center" onLayout={onLayout}>
          {layout && (
            <Carousel
              ref={carouselRef}
              data={contentData}
              renderItem={renderItem}
              sliderWidth={layout.width}
              itemWidth={layout.width}
              itemHeight={layout.height}
              onSnapToItem={newIndex => setCurrentIndex(newIndex)}
            />
          )}
        </Box>
        <Box flexDirection="row" padding="l">
          <Box flex={1}>{isStart ? LanguageButton : BackButton}</Box>
          <Box flex={1} justifyContent="center">
            <ProgressCircles alignSelf="center" numberOfSteps={contentData.length} activeStep={currentIndex + 1} />
          </Box>
          <Box flex={1}>
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
});
