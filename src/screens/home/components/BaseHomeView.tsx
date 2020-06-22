import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Box, Header, Icon, IconName} from 'components';

interface BaseHomeViewProps {
  children?: React.ReactNode;
  iconName?: IconName;
}

export const BaseHomeView = ({children, iconName}: BaseHomeViewProps) => {
  return (
    <SafeAreaView>
      <Header />
      <ScrollView style={styles.flex} contentContainerStyle={[styles.scrollContainer]} bounces={false}>
        <Box marginTop="xxl">
          <Icon name={iconName} size={110} />
        </Box>
        <Box flex={1} alignItems="flex-start" justifyContent="flex-end" marginHorizontal="xl">
          {children}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContainerWithAnimation: {
    marginTop: -100,
  },
  scrollContainer: {
    minHeight: '90%',
    alignItems: 'center',
  },
  animationBase: {
    marginBottom: -100,
  },
});
