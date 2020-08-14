import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {Box} from 'components';
import ScrollView from 'rn-faded-scrollview';
import {useOrientation} from 'shared/useOrientation';

import {Start} from './views/Start';
import {Anonymous} from './views/Anonymous';
import {HowItWorks} from './views/HowItWorks';
import {Permissions} from './views/Permissions';
import {Region} from './views/Region';
import {ItemViewProps} from './views/ItemView';
import {PartOf} from './views/PartOf';

export type OnboardingKey = 'step-1' | 'step-2' | 'step-3' | 'step-4' | 'step-5' | 'step-6';

export const onboardingData: OnboardingKey[] = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6'];

const viewComponents: {[key in OnboardingKey]: React.ComponentType<Pick<ItemViewProps, 'isActive'>>} = {
  'step-1': Start,
  'step-2': Anonymous,
  'step-3': HowItWorks,
  'step-4': PartOf,
  'step-5': Permissions,
  'step-6': Region,
};

export interface OnboardingContentProps {
  item: OnboardingKey;
  isActive: boolean;
}

export const OnboardingContent = ({item, isActive}: OnboardingContentProps) => {
  const Item = viewComponents[item];
  const {orientation} = useOrientation();
  const rightPadding = orientation === 'landscape' && Platform.OS === 'ios' ? 'xxl' : 'm';
  const rightMargin = orientation === 'landscape' && Platform.OS === 'ios' ? 'l' : 'none';
  return (
    <ScrollView
      testID={`${item}OnboardingScrollView`}
      fadeSize={50}
      fadeColors={['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.9)']}
      style={styles.flex}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <Box paddingLeft="m" paddingTop="s" paddingRight={rightPadding} marginRight={rightMargin}>
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
