import React, {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import {useI18n} from 'locale';
import {getNonIgnoredFromHistoryOutbreakHistory} from 'shared/qr';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, ToolbarWithClose, Button} from 'components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {useOutbreakService} from 'services/OutbreakService';
import {getCurrentDate} from 'shared/date-fns';
import {
  useDisplayExposureHistory,
  useClearExposedStatus,
  useExposureStatus,
} from 'services/ExposureNotificationService';
import {log} from 'shared/logging/config';
import {FilteredMetricsService, EventTypeMetric} from 'services/MetricsService';
import styles from 'shared/Styles';

import {ExposureList} from './views/ExposureList';
import {NoExposureHistoryScreen} from './views/NoExposureHistoryScreen';
import {toOutbreakExposureHistoryData, toProximityExposureHistoryData} from './utils';

export const ExposureHistoryScreenState = {
  exposureHistoryClearedDate: getCurrentDate(),
};

export const ExposureHistoryScreen = () => {
  const [state, setState] = useState(ExposureHistoryScreenState);
  const i18n = useI18n();
  const [clearExposedStatus] = useClearExposedStatus();
  const exposureStatus = useExposureStatus();
  const outbreaks = useOutbreakService();
  const nonIgnoredFromHistoryOutbreakHistory = getNonIgnoredFromHistoryOutbreakHistory(outbreaks.outbreakHistory);
  const {proximityExposureHistory, ignoreAllProximityExposuresFromHistory} = useDisplayExposureHistory();
  const mergedArray = [
    ...toOutbreakExposureHistoryData({history: nonIgnoredFromHistoryOutbreakHistory, i18n}),
    ...toProximityExposureHistoryData({proximityExposureHistory, i18n}),
  ];

  const navigation = useNavigation();
  const close = useCallback(() => navigation.navigate('Menu'), [navigation]);
  log.debug({category: 'debug', message: 'creating merged exposure history array', payload: {mergedArray}});
  const deleteAllExposures = () => {
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
            outbreaks.ignoreAllOutbreaksFromHistory();
            outbreaks.ignoreAllOutbreaks();
            ignoreAllProximityExposuresFromHistory();
            clearExposedStatus();
            FilteredMetricsService.sharedInstance().addEvent({type: EventTypeMetric.ExposedClear, exposureStatus});
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
          <Box paddingHorizontal="m">
            <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
              {i18n.translate('ExposureHistory.Title')}
            </Text>
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
                    onPress={deleteAllExposures}
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
