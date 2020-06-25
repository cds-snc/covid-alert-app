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
    <SafeAreaView style={styles.flex}>
      <Header />
      <ScrollView contentContainerStyle={[styles.scrollContainer]} bounces={false}>
        <Box width="100%" justifyContent="flex-start">
          <Box style={{...styles.primaryIcon}}>
            <Icon name={iconName} size={150} />
          </Box>
        </Box>
        <Box flex={1} alignItems="flex-start" justifyContent="flex-start" marginHorizontal="xl">
          {children}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  primaryIcon: {marginLeft: 0, marginBottom: 30},
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
