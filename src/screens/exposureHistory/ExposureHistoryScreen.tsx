import React, {useCallback, useState} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {useI18n, I18n} from 'locale';
import {
  CombinedExposureHistoryData,
  ExposureType,
  getCurrentOutbreakHistory,
  OutbreakHistoryItem,
  OutbreakSeverity,
} from 'shared/qr';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, ToolbarWithClose, Button} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {useOutbreakService} from 'services/OutbreakService';
import {getCurrentDate} from 'shared/date-fns';
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
      exposureType: ExposureType.Outbreak,
      subtitle: severityText({severity: Number(outbreak.severity), i18n}),
      timestamp: outbreak.checkInTimestamp,
    };
  });
};

const toProximityExposureHistoryData = ({
  proximityExposureTimestamps,
  i18n,
}: {
  proximityExposureTimestamps: number[];
  i18n: I18n;
}): CombinedExposureHistoryData[] => {
  return proximityExposureTimestamps.map(timestamp => {
    return {
      exposureType: ExposureType.Proximity,
      subtitle: i18n.translate('QRCode.ProximityExposure'),
      timestamp,
    };
  });
};

export const ExposureHistoryScreenState = {
  exposureHistoryClearedDate: getCurrentDate(),
};

export const ExposureHistoryScreen = () => {
  const [state, setState] = useState(ExposureHistoryScreenState);
  const i18n = useI18n();
  const outbreaks = useOutbreakService();
  const [clearExposedStatus] = useClearExposedStatus();
  const currentOutbreakHistory = getCurrentOutbreakHistory(outbreaks.outbreakHistory);
  const proximityExposureTimestamps = useExposureHistory();
  const mergedArray = [
    ...toOutbreakExposureHistoryData({history: currentOutbreakHistory, i18n}),
    ...toProximityExposureHistoryData({proximityExposureTimestamps, i18n}),
  ];
  const clearProximityExposure = useCallback(() => {
    clearExposedStatus();
  }, [clearExposedStatus]);

  const navigation = useNavigation();
  const close = useCallback(() => navigation.navigate('Menu'), [navigation]);

  const deleteAllPlaces = () => {
    Alert.alert(
      i18n.translate('ExposureHistory.Alert.TitleDeleteAll'),
      i18n.translate('ExposureHistory.Alert.SubtitleDeleteAll'),
      [
        {
          text: i18n.translate('ExposureHistory.Alert.Cancel'),
          onPress: () => {},
        },
        {
          text: i18n.translate('ExposureHistory.Alert.ConfirmDeleteAll'),
          onPress: () => {
            outbreaks.clearOutbreakHistory();
            clearProximityExposure();
            setState({...state, exposureHistoryClearedDate: getCurrentDate()});
          },
          style: 'cancel',
        },
      ],
    );
  };

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <ToolbarWithClose closeText={i18n.translate('DataUpload.Close')} showBackButton={false} onClose={close} />
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
                  <Button
                    variant="opaqueGrey"
                    text={i18n.translate('ExposureHistory.DeleteAllExposures')}
                    onPress={deleteAllPlaces}
                  />
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
