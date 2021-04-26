import React, {useCallback, useState, useMemo} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {useI18n} from 'locale';
import {CombinedExposureHistoryData} from 'shared/qr';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, Icon, Toolbar, Button} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useExposureHistory} from 'services/ExposureNotificationService';
import {useOutbreakService} from 'shared/OutbreakProvider';
// import {combinedExposureArray} from './utils';
import {formatExposedDate, formateScannedDate, accessibilityReadableDate} from 'shared/date-fns';

const ExposureList = ({exposureHistoryData}: {exposureHistoryData: CombinedExposureHistoryData[]}) => {
  const i18n = useI18n();
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  return (
    <>
      {Object.keys(exposureHistoryData).map(item => {
        return (
          <Box key={item}>
            <Box backgroundColor="gray5" style={styles.radius}>
              {exposureHistoryData.map((data: any, index: number) => {
                return (
                  <Box paddingHorizontal="m" style={[exposureHistoryData.length !== index + 1 && styles.bottomBorder]}>
                    <Box paddingVertical="m" style={styles.exposureList}>
                      <Box style={styles.typeIconBox}>
                        <Icon size={20} name={data.type === 'proximity' ? 'exposure-proximity' : 'exposure-outbreak'} />
                      </Box>

                      <Box style={styles.boxFlex}>
                        {/* <Text key={index}> */}
                        <Text fontWeight="bold">{formatExposedDate(new Date(data.timestamp), dateLocale)}</Text>
                        <Text>{data.type}</Text>
                        {/* </Text> */}
                      </Box>

                      <Box style={styles.chevronIconBox}>
                        <TouchableOpacity style={styles.chevronIcon}>
                          <Icon size={30} name="icon-chevron" />
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </>
  );
};

const NoExposureHistoryScreen = () => {
  const i18n = useI18n();

  return (
    <Box style={styles.noExposureHistoryScreen} marginTop="xl">
      <Icon height={120} width={150} name="exposure-history-thumb" />
      <Text paddingTop="s" fontWeight="bold">
        {i18n.translate('ExposureHistory.NoExposures')}
      </Text>
    </Box>
  );
};

export const ExposureHistoryScreen = () => {
  const exposureHistoryProximity = useExposureHistory();
  const {
    combinedExposureHistory,
    addToCombinedExposureHistory,
    deleteAllCombinedExposureHistory,
    outbreakHistory,
  } = useOutbreakService();

  const deleteAllPlaces = () => {
    Alert.alert(i18n.translate('PlacesLog.Alert.TitleDeleteAll'), i18n.translate('PlacesLog.Alert.Subtitle'), [
      {
        text: i18n.translate('PlacesLog.Alert.Cancel'),
        onPress: () => {},
      },
      {
        text: i18n.translate('PlacesLog.Alert.ConfirmDeleteAll'),
        onPress: () => {
          deleteAllCombinedExposureHistory();
        },
        style: 'cancel',
      },
    ]);
  };

  const i18n = useI18n();

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

          {combinedExposureHistory.length === 0 ? (
            <NoExposureHistoryScreen />
          ) : (
            <>
              <Box paddingHorizontal="xxs" marginLeft="m" marginRight="m" paddingBottom="m">
                <ExposureList exposureHistoryData={combinedExposureHistory} />
              </Box>
            </>
          )}
          <Box margin="m">
            {/* make this add an exposure */}
            <Button variant="opaqueGrey" text="Delete All" onPress={deleteAllPlaces} />
          </Box>
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
  exposureList: {
    flexDirection: 'row',
  },
  boxFlex: {
    flex: 4,
  },
  chevronIcon: {
    alignItems: 'flex-end',
  },
  chevronIconBox: {
    flex: 1,
    justifyContent: 'center',
  },
  typeIconBox: {
    flex: 1,
    justifyContent: 'center',
  },
});
