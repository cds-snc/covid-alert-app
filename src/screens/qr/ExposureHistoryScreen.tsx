import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useI18n, I18n} from 'locale';
import {CombinedExposureHistoryData, getCurrentOutbreakHistory, OutbreakHistoryItem, OutbreakSeverity} from 'shared/qr';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, Icon, Toolbar, Button} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {useOutbreakService} from 'services/OutbreakService';
import {formatExposedDate} from 'shared/date-fns';
import {useExposureHistory, useClearExposedStatus} from 'services/ExposureNotificationService';

const severityText = ({severity, i18n}: {severity: OutbreakSeverity; i18n: I18n}) => {
  switch (severity) {
    case OutbreakSeverity.GetTested:
      return i18n.translate('QRCode.OutbreakExposed.GetTested.Title');
    case OutbreakSeverity.SelfIsolate:
      return i18n.translate('QRCode.OutbreakExposed.SelfIsolate.Title');
    case OutbreakSeverity.SelfMonitor:
      return i18n.translate('QRCode.OutbreakExposed.SelfMonitor.Title');
  }
};

const toOutbreakExposureHistoryData = ({
  history,
  i18n,
}: {
  history: OutbreakHistoryItem[];
  i18n: I18n;
}): CombinedExposureHistoryData[] => {
  return history.map(outbreak => {
    return {
      id: outbreak.locationId,
      type: 'exposure',
      subtitle: severityText({severity: Number(outbreak.severity), i18n}),
      timestamp: outbreak.checkInTimestamp,
    };
  });
};

const toProximityExposureHistoryData = ({
  history,
  i18n,
}: {
  history: number[];
  i18n: I18n;
}): CombinedExposureHistoryData[] => {
  return history.map(outbreak => {
    return {
      id: outbreak,
      type: 'proximity',
      subtitle: i18n.translate('QRCode.ProximityExposure'),
      timestamp: outbreak,
    };
  });
};

const ExposureList = ({exposureHistoryData}: {exposureHistoryData: CombinedExposureHistoryData[]}) => {
  const i18n = useI18n();
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const navigation = useNavigation();
  const onDetails = useCallback(
    ({id, exposureType}) => navigation.navigate('RecentExposureScreen', {id, exposureType}),
    [navigation],
  );

  return (
    <>
      {exposureHistoryData.map((item, index) => {
        return (
          <Box key={item.timestamp}>
            <Box backgroundColor="gray5" style={styles.radius}>
              <Box paddingHorizontal="m" style={[exposureHistoryData.length !== index + 1 && styles.bottomBorder]}>
                <TouchableOpacity
                  style={styles.chevronIcon}
                  onPress={() => {
                    onDetails({id: `${item.id}-${item.timestamp}`, exposureType: item.type});
                  }}
                >
                  <Box paddingVertical="m" style={styles.exposureList}>
                    <Box style={styles.typeIconBox}>
                      <Icon size={20} name={item.type === 'proximity' ? 'exposure-proximity' : 'exposure-outbreak'} />
                    </Box>
                    <Box style={styles.boxFlex}>
                      <Text fontWeight="bold">{formatExposedDate(new Date(item.timestamp), dateLocale)}</Text>
                      <Text>{item.subtitle}</Text>
                    </Box>
                    <Box style={styles.chevronIconBox}>
                      <Icon size={30} name="icon-chevron" />
                    </Box>
                  </Box>
                </TouchableOpacity>
              </Box>
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
  const i18n = useI18n();
  const outbreaks = useOutbreakService();
  const [clearExposedStatus] = useClearExposedStatus();
  const currentOutbreakHistory = getCurrentOutbreakHistory(outbreaks.outbreakHistory);
  const proximityExposure = useExposureHistory();
  const mergedArray = [
    ...toOutbreakExposureHistoryData({history: currentOutbreakHistory, i18n}),
    ...toProximityExposureHistoryData({history: proximityExposure, i18n}),
  ];
  const clearProximityExposure = useCallback(() => {
    clearExposedStatus();
  }, [clearExposedStatus]);

  const navigation = useNavigation();
  const back = useCallback(() => navigation.goBack(), [navigation]);

  const deleteAllPlaces = () => {
    Alert.alert(i18n.translate('PlacesLog.Alert.TitleDeleteAll'), i18n.translate('PlacesLog.Alert.Subtitle'), [
      {
        text: i18n.translate('PlacesLog.Alert.Cancel'),
        onPress: () => {},
      },
      {
        text: i18n.translate('PlacesLog.Alert.ConfirmDeleteAll'),
        onPress: () => {
          outbreaks.deleteAllScannedPlaces();
          clearProximityExposure();
        },
        style: 'cancel',
      },
    ]);
  };

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <Toolbar title="" navIcon="icon-back-arrow" navText={i18n.translate('PlacesLog.Back')} onIconClicked={back} />
        <ScrollView style={styles.flex}>
          <Box paddingHorizontal="m" paddingBottom="m">
            <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
              {i18n.translate('ExposureHistory.Title')}
            </Text>
            <Text>{i18n.translate('ExposureHistory.Body')}</Text>
          </Box>

          {mergedArray.length === 0 ? (
            <NoExposureHistoryScreen />
          ) : (
            <>
              <Box paddingHorizontal="xxs" marginLeft="m" marginRight="m" paddingBottom="m">
                <ExposureList exposureHistoryData={mergedArray} />

                <Box marginTop="m">
                  <Button variant="opaqueGrey" text="Delete All" onPress={deleteAllPlaces} />
                </Box>
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
