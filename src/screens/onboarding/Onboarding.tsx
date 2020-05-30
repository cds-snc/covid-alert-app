import React, {useCallback, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Button, ProgressCircles, Header, LanguageToggle} from 'components';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {SafeAreaView, useSafeArea} from 'react-native-safe-area-context';
import Carousel, {CarouselStatic} from 'react-native-snap-carousel';
import {useStorage} from 'services/StorageService';
import {useI18n} from '@shopify/react-i18n';
import OnboardingBg from 'assets/onboarding-bg.svg';
import {useMaxContentWidth} from 'shared/useMaxContentWidth';

import {Permissions} from './views/Permissions';
import {Start} from './views/Start';

type ViewKey = 'start' | 'permissions';

const contentData: ViewKey[] = ['start', 'permissions'];
const viewComponents = {
  start: Start,
  permissions: Permissions,
};

export const OnboardingScreen = () => {
  const [i18n] = useI18n();
  const {width: viewportWidth} = useWindowDimensions();
  const insets = useSafeArea();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const {setOnboarded} = useStorage();
  const navigation = useNavigation();
  const handlePermissions = useCallback(() => {
    // handle all our app permission stuff
    setOnboarded(true);
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  }, [navigation, setOnboarded]);

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
        handlePermissions();
        return;
      }
      (carouselRef.current! as CarouselStatic<ViewKey>).snapToNext();
    }
  }, [currentIndex, handlePermissions]);

  const prevItem = useCallback(() => {
    if (carouselRef.current) {
      (carouselRef.current! as CarouselStatic<ViewKey>).snapToPrev();
    }
  }, []);

  const isStart = currentIndex === 0;
  const isEnd = currentIndex === contentData.length - 1;

  const BackButton = <Button text={i18n.translate('Onboarding.ActionBack')} variant="subduedText" onPress={prevItem} />;
  const LanguageButton = <LanguageToggle />;

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <Box position="absolute" bottom={50 + insets.bottom} width="100%" opacity={0.4}>
        <OnboardingBg width="100%" viewBox="0 0 375 325" />
      </Box>
      <SafeAreaView style={styles.flex}>
        <Header isOverlay />
        <Carousel
          ref={carouselRef}
          data={contentData}
          renderItem={renderItem}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth}
          onSnapToItem={newIndex => setCurrentIndex(newIndex)}
        />
        <Box alignItems="center" justifyContent="center" flexDirection="row">
          <Box flex={1} paddingHorizontal="l" paddingBottom="l">
            {isStart ? LanguageButton : BackButton}
          </Box>
          <ProgressCircles numberOfSteps={contentData.length} activeStep={currentIndex + 1} marginBottom="l" />
          <Box flex={1} paddingHorizontal="l" paddingBottom="l">
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
