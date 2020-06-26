import React, {useCallback, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';
import {Box, Button, Header, LanguageToggle, ProgressCircles} from 'components';
import {LayoutChangeEvent, LayoutRectangle, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Carousel, {CarouselStatic} from 'react-native-snap-carousel';
import {useMaxContentWidth} from 'shared/useMaxContentWidth';

import {Start} from './views/Start';
import {WhatItsNot} from './views/WhatItsNot';
import {Anonymous} from './views/Anonymous';
import {HowItWorks} from './views/HowItWorks';
import {Permissions} from './views/Permissions';

type ViewKey = 'start' | 'whatItsNot' | 'anonymous' | 'permissions' | 'howItWorks';

const contentData: ViewKey[] = ['start', 'whatItsNot', 'anonymous', 'howItWorks', 'permissions'];
const viewComponents = {
  start: Start,
  whatItsNot: WhatItsNot,
  anonymous: Anonymous,
  howItWorks: HowItWorks,
  permissions: Permissions,
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
        <Box flexDirection="row" marginBottom="l">
          <Box flex={1}>{isStart ? LanguageButton : BackButton}</Box>
          <Box flex={0} justifyContent="center">
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
