import React, {useCallback, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';
import {Box, Button, Text} from 'components';
import {View, LayoutChangeEvent, LayoutRectangle, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Carousel, {CarouselStatic, Pagination} from 'react-native-snap-carousel';
import {useMaxContentWidth} from 'shared/useMaxContentWidth';
import {useStorage} from 'services/StorageService';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';

type ViewKey = 'start' | 'whatItsNot' | 'anonymous' | 'howItWorks' | 'permissions' | 'region';

const contentData: ViewKey[] = ['start', 'whatItsNot', 'anonymous', 'howItWorks', 'permissions', 'region'];

export const BaseOnboardingView = ({children}: {children: React.ReactNode}) => {
  const [i18n] = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const navigation = useNavigation();
  const {region, setRegion, setOnboarded, setOnboardedDatetime} = useStorage();
  const startExposureNotificationService = useStartExposureNotificationService();
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

  const nextItem = useCallback(async () => {
    if (carouselRef.current) {
      if (currentIndex === contentData.length - 1) {
        await setOnboarded(true);
        await setOnboardedDatetime(new Date());
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });

        return;
      }
      (carouselRef.current! as CarouselStatic<ViewKey>).snapToNext();
    }
  }, [currentIndex, navigation, setOnboarded, setOnboardedDatetime]);

  const onSnapToNewPage = (index: number) => {
    // we want the EN permission dialogue to appear on the last step.
    if (index === contentData.length - 1) {
      startExposureNotificationService();
    }

    // we want region cleared on the 2nd last step
    if (index === contentData.length - 2) {
      setRegion(undefined);
    }
  };

  const prevItem = useCallback(() => {
    if (carouselRef.current) {
      (carouselRef.current! as CarouselStatic<ViewKey>).snapToPrev();
    }
  }, []);

  const isStart = currentIndex === 0;
  const isEnd = currentIndex === contentData.length - 1;

  let endText = 'EndSkip';
  let endBtnStyle = '';

  if (isEnd && region && region !== 'None') {
    endText = 'End';
    endBtnStyle = 'ready';
  }

  const BackButton = (
    <Button
      backButton
      text={i18n.translate('Onboarding.ActionBack')}
      color="linkText"
      variant="subduedText"
      onPress={prevItem}
    />
  );

  const [layout, setLayout] = useState<LayoutRectangle | undefined>();
  const onLayout = useCallback(({nativeEvent: {layout}}: LayoutChangeEvent) => {
    setLayout(layout);
  }, []);

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <Box flexDirection="row">
          <Box align-self="flex-start" style={isStart ? styles.spacer : null}>
            {isStart ? null : BackButton}
          </Box>
        </Box>

        <Box flex={1} paddingTop="s" justifyContent="center" onLayout={onLayout}>
          {layout && (
            <View style={styles.viewOffset}>
              <Box height={5} maxHeight={2} borderTopWidth={2} borderTopColor="gray5" />
              {children}
            </View>
          )}
        </Box>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  spacer: {
    marginBottom: 57,
  },
  viewOffset: {
    marginTop: 50,
  },
  flex: {
    flex: 1,
  },
  dotContainerStyle: {},
  dotWrapperStyle: {
    marginBottom: 20,
    fontSize: 20,
  },
});
