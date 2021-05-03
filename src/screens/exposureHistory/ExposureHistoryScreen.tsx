import React, {useCallback} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {useI18n, I18n} from 'locale';
import {CombinedExposureHistoryData, getCurrentOutbreakHistory, OutbreakHistoryItem, OutbreakSeverity} from 'shared/qr';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, Toolbar, Button} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {useOutbreakService} from 'services/OutbreakService';
import {useExposureHistory, useClearExposedStatus} from 'services/ExposureNotificationService';

import {ExposureList} from './views/ExposureList';
import {NoExposureHistoryScreen} from './views/NoExposureHistoryScreen';

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
  flex: {
    flex: 1,
  },
});
