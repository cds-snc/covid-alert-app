import React from 'react';
import {StyleSheet} from 'react-native';
import {Box} from 'components';
import ScrollView from 'rn-faded-scrollview';

import {Start} from './views/Start';
import {Anonymous} from './views/Anonymous';
import {HowItWorks} from './views/HowItWorks';
import {Permissions} from './views/Permissions';
import {Region} from './views/Region';
import {ItemViewProps} from './views/ItemView';

export type OnboardingKey = 'step-1' | 'step-2' | 'step-3' | 'step-4' | 'step-5';

export const onboardingData: OnboardingKey[] = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'];

const viewComponents: {[key in OnboardingKey]: React.ComponentType<Pick<ItemViewProps, 'isActive'>>} = {
  'step-1': Start,
  'step-2': Anonymous,
  'step-3': HowItWorks,
  'step-4': Permissions,
  'step-5': Region,
};

export interface OnboardingContentProps {
  item: OnboardingKey;
  isActive: boolean;
}

export const OnboardingContent = ({item, isActive}: OnboardingContentProps) => {
  const Item = viewComponents[item];
  return (
    <ScrollView
      fadeSize={50}
      fadeColors={['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.9)']}
      style={styles.flex}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <Box paddingHorizontal="m" paddingTop="s">
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
