import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {useI18n} from 'locale';
import {ExposureHistoryData} from 'shared/qr';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, Icon, Toolbar} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

const ExposureList = ({exposureHistoryData}: {exposureHistoryData: ExposureHistoryData[]}) => {
  return (
    <>
      {Object.keys(exposureHistoryData).map(item => {
        return <Box key={item}></Box>;
      })}
    </>
  );
};

const NoExposureHistoryScreen = () => {
  const i18n = useI18n();

  return (
    <Box style={styles.noExposureHistoryScreen} marginTop="xl">
      <Text paddingTop="s" fontWeight="bold">
        {i18n.translate('ExposureHistory.Title')}
      </Text>
      <Icon height={120} width={150} name="no-visit-icon" />
    </Box>
  );
};

export const ExposureHistoryScreen = () => {
  const i18n = useI18n();
  const exposureHistory = [];
  const navigation = useNavigation();
  const back = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <Toolbar title="" navIcon="icon-back-arrow" navText={i18n.translate('PlacesLog.Back')} onIconClicked={back} />
        <ScrollView style={styles.flex}>
          <Box paddingHorizontal="m">
            <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header">
              {i18n.translate('ExposureHistory.Title')}
            </Text>
            <Text>{i18n.translate('ExposureHistory.Body')}</Text>
          </Box>

          {exposureHistory.length === 0 ? (
            <NoExposureHistoryScreen />
          ) : (
            <>
              <Box paddingHorizontal="xxs" marginLeft="m" marginRight="m" paddingBottom="m">
                <ExposureList exposureHistoryData={[]} />
              </Box>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  boxStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBorder: {
    borderBottomColor: '#8a8a8a',
    borderBottomWidth: 1,
  },
  textBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radius: {
    borderRadius: 10,
  },
  noExposureHistoryScreen: {
    flex: 1,
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
});
