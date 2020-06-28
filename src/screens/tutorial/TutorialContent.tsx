import React from 'react';
import {StyleSheet, ScrollView, ImageSourcePropType} from 'react-native';
import {Box, Text, OnboardingHeader} from 'components';
import {useI18n} from '@shopify/react-i18n';

export type TutorialKey = 'step-1' | 'step-2' | 'step-3' | 'step-4';

export const tutorialData: TutorialKey[] = ['step-1', 'step-2', 'step-3', 'step-4'];

interface ImageDataInterface {
  [key: string]: {source: ImageSourcePropType};
}

export const imageData: ImageDataInterface = {
  'step-1': {
    source: require('assets/onboarding-neighbourhood.png'),
  },
  'step-2': {
    source: require('assets/onboarding-neighbourhood.png'),
  },
  'step-3': {
    source: require('assets/onboarding-neighbourhood.png'),
  },
  'step-4': {
    source: require('assets/how-it-works-exposures.png'),
  },
};

export const TutorialContent = ({
  item,
  currentIndex,
}: {
  item: TutorialKey;
  currentIndex: number;
  isActiveSlide: boolean;
}) => {
  const [i18n] = useI18n();

  const step = `step-${currentIndex}`;
  const image = imageData[step].source;

  const itemTitle = i18n.translate(`Tutorial.${item}Title`);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box paddingVertical="s" paddingHorizontal="xxl">
        <OnboardingHeader imageSrc={image} text={itemTitle} />
        <Text variant="bodyText" color="overlayBodyText">
          {i18n.translate(`Tutorial.${item}`)}
        </Text>
      </Box>
    </ScrollView>
  );
};

TutorialContent.defaultProps = {
  currentIndex: 1,
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
  },
});
