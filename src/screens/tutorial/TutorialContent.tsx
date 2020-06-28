import React from 'react';
import {StyleSheet, ScrollView, ImageSourcePropType} from 'react-native';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {OnboardingHeader} from '../onboarding/components/OnboardingHeader';

export type TutorialKey = 'step-1' | 'step-2' | 'step-3' | 'step-4' | 'step-5' | 'step-6';

export const tutorialData: TutorialKey[] = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6'];

interface myObjInterface {
  [key: string]: {source: ImageSourcePropType};
}

export const imageData: myObjInterface = {
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
    source: require('assets/onboarding-neighbourhood.png'),
  },
  'step-5': {
    source: require('assets/onboarding-neighbourhood.png'),
  },
  'step-6': {
    source: require('assets/onboarding-neighbourhood.png'),
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

  const step: string = `step-${currentIndex}`;
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
