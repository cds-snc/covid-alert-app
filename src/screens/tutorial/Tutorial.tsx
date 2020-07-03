import React, {useState, useCallback, useRef} from 'react';
import {StyleSheet, useWindowDimensions, View, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Box, Button, Toolbar, ProgressCircles} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from '@shopify/react-i18n';

import {TutorialContent, tutorialData, TutorialKey} from './TutorialContent';

export const TutorialScreen = () => {
  const navigation = useNavigation();
  const {width: viewportWidth} = useWindowDimensions();
  const flatListRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [i18n] = useI18n();
  const close = useCallback(() => navigation.goBack(), [navigation]);

  const isStart = currentStep === 0;
  const isEnd = currentStep === tutorialData.length - 1;

  const renderItem = useCallback(({item}: {item: TutorialKey}) => {
    return (
      <Box flex={1} width={viewportWidth}>
        <View>
          <TutorialContent item={item} key={item} />
        </View>
      </Box>
    );
  }, []);

  const nextItem = useCallback(() => {
    if (flatListRef.current) {
      if (isEnd) {
        close();
        return;
      }
      (flatListRef.current! as FlatList<TutorialKey>).scrollToIndex({index: currentStep + 1});
    }
  }, [close, isEnd, currentStep]);

  const prevItem = useCallback(() => {
    if (flatListRef.current) {
      (flatListRef.current! as FlatList<TutorialKey>).scrollToIndex({index: currentStep - 1});
    }
  }, [currentStep]);

  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length <= 0) {
      return;
    }
    const index: number = viewableItems[0].index;
    setCurrentStep(index);
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

        <FlatList
          ref={flatListRef}
          data={tutorialData}
          renderItem={renderItem}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          horizontal
          disableIntervalMomentum
          pagingEnabled
        />

        <Box flexDirection="row" borderTopWidth={2} borderTopColor="gray5">
          <Box flex={1}>
            {!isStart && (
              <Button text={i18n.translate(`Tutorial.ActionBack`)} variant="subduedText" onPress={prevItem} />
            )}
          </Box>
          <Box flex={1} justifyContent="center">
            <ProgressCircles numberOfSteps={tutorialData.length} activeStep={currentStep + 1} marginBottom="none" />
          </Box>

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
