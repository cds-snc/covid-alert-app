import React from 'react';
import {StyleSheet} from 'react-native';
import {Box} from 'components';
import ScrollView from 'rn-faded-scrollview';

import {Step1} from './views/Step1';
import {Step2} from './views/Step2';
import {Step3} from './views/Step3';
import {Step4} from './views/Step4';
import {ItemViewProps} from './views/ItemView';

export type TutorialKey = 'step-1' | 'step-2' | 'step-3' | 'step-4';

export const tutorialData: TutorialKey[] = ['step-1', 'step-2', 'step-3', 'step-4'];

const viewComponents: {[key in TutorialKey]: React.ComponentType<Pick<ItemViewProps, 'isActive'>>} = {
  'step-1': Step1,
  'step-2': Step2,
  'step-3': Step3,
  'step-4': Step4,
};

export interface TutorialContentProps {
  item: TutorialKey;
  isActive: boolean;
}

export const TutorialContent = ({item, isActive}: TutorialContentProps) => {
  const Item = viewComponents[item];
  return (
    <ScrollView
      testID={`${item}howItWorksScrollView`}
      fadeSize={50}
      fadeColors={['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.9)']}
      style={styles.flex}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <Box paddingHorizontal="m">
        <Item isActive={isActive} />
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
});
