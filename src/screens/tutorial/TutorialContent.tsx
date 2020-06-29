import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Box} from 'components';

import {Step1} from './views/Step1';
import {Step2} from './views/Step2';
import {Step3} from './views/Step3';
import {Step4} from './views/Step4';

export type TutorialKey = 'step-1' | 'step-2' | 'step-3' | 'step-4';

export const tutorialData: TutorialKey[] = ['step-1', 'step-2', 'step-3', 'step-4'];

const viewComponents = {
  'step-1': Step1,
  'step-2': Step2,
  'step-3': Step3,
  'step-4': Step4,
};

export const TutorialContent = ({
  item,
  currentIndex,
}: {
  item: TutorialKey;
  currentIndex: number;
  isActiveSlide: boolean;
}) => {
  const Item = viewComponents[item];
  return (
    <ScrollView key={currentIndex} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box paddingVertical="s" paddingHorizontal="xxl">
        <Item />
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
