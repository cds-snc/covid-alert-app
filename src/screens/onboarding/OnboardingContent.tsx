import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Box} from 'components';

import {Start} from './views/Start';
import {Anonymous} from './views/Anonymous';
import {HowItWorks} from './views/HowItWorks';
import {Permissions} from './views/Permissions';
import {WhatItsNot} from './views/WhatItsNot';
import {Region} from './views/Region';
import {ItemViewProps} from './views/ItemView';

export type OnboardingKey = 'step-1' | 'step-2' | 'step-3' | 'step-4' | 'step-5' | 'step-6';

export const onboardingData: OnboardingKey[] = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6'];

const viewComponents: {[key in OnboardingKey]: React.ComponentType<Pick<ItemViewProps, 'isActive'>>} = {
  'step-1': Start,
  'step-2': Anonymous,
  'step-3': WhatItsNot,
  'step-4': HowItWorks,
  'step-5': Permissions,
  'step-6': Region,
};

export interface OnboardingContentProps {
  item: OnboardingKey;
  isActive: boolean;
}

export const OnboardingContent = ({item, isActive}: OnboardingContentProps) => {
  const Item = viewComponents[item];
  return (
    <ScrollView style={styles.flex} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Box paddingHorizontal="l" paddingTop="s">
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
