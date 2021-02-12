import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Box, Header, Icon, IconName, RoundedBox} from 'components';

interface BaseHomeViewProps {
  children?: React.ReactNode;
  testID?: string;
}

export const BaseHomeView = ({children, testID}: BaseHomeViewProps) => {
  return (
    <>
      <SafeAreaView edges={['top']}>
        <Header />
      </SafeAreaView>
      <ScrollView
        alwaysBounceVertical={false}
        style={styles.scrollView}
        testID={testID}
        contentContainerStyle={styles.scrollContainer}
      >
        <SafeAreaView edges={['left', 'right']}>{children}</SafeAreaView>
      </ScrollView>
    </>
  );
};

interface ExposureStatusWrapperProps {
  children?: React.ReactNode;
  testID?: string;
  iconName?: IconName;
}

export const ExposureStatusWrapper = ({children, iconName}: ExposureStatusWrapperProps) => {
  return (
    <>
      <Box style={styles.banner} marginBottom="-xxl">
        <Box width="100%" justifyContent="flex-start" style={styles.banner}>
          <Box style={{...styles.primaryIcon}}>
            <Icon name={iconName} height={120} width={150} />
          </Box>
        </Box>
      </Box>
      <Box
        width="100%"
        flex={1}
        alignItems="flex-start"
        justifyContent="flex-start"
        paddingHorizontal="m"
        marginBottom="l"
      >
        <RoundedBox>{children}</RoundedBox>
      </Box>
    </>
  );
};

interface SystemStatusWrapperProps {
  children?: React.ReactNode;
  testID?: string;
  iconName?: IconName;
}

export const SystemStatusWrapper = ({children, iconName}: SystemStatusWrapperProps) => {
  return (
    <Box marginHorizontal="m" marginBottom="m">
      <RoundedBox>
        <Icon name={iconName} height={40} width={40} />
        {children}
      </RoundedBox>
    </Box>
  );
};

const styles = StyleSheet.create({
  primaryIcon: {
    marginLeft: -40,
    marginBottom: 30,
  },
  banner: {
    backgroundColor: '#573EC5',
  },
  scrollContainerWithAnimation: {
    marginTop: -100,
  },
  scrollView: {
    height: '100%',
  },
  scrollContainer: {
    maxWidth: 600,
    alignItems: 'flex-start',
  },
});
