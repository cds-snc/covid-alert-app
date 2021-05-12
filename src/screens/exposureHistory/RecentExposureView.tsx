import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {Box, ButtonSingleLine, Icon, ToolbarWithClose} from 'components';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {Alert, StyleSheet} from 'react-native';
import {ExposureType} from 'shared/qr';
import {useOutbreakService} from 'services/OutbreakService';
import {log} from 'shared/logging/config';
import {getCurrentDate} from 'shared/date-fns';
import {
  useClearExposedStatus,
  useDisplayExposureHistory,
  useRemoveFromExposureHistory,
} from 'services/ExposureNotificationService';

import {MainStackParamList} from '../../navigation/MainNavigator';

import {OutbreakExposureContent} from './views/OutbreakExposureContent';
import {ProximityExposureContent} from './views/ProximityExposureContent';

type RecentExposureScreenProps = RouteProp<MainStackParamList, 'RecentExposureScreen'>;

const ExposureContent = ({exposureType, timestamp}: {exposureType: ExposureType; timestamp: number}) => {
  if (exposureType === ExposureType.Outbreak) {
    return <OutbreakExposureContent timestamp={timestamp} />;
  }
  if (exposureType === ExposureType.Proximity) {
    return <ProximityExposureContent timestamp={timestamp} />;
  }
  return null;
};

export const RecentExposureScreen = () => {
  const route = useRoute<RecentExposureScreenProps>();
  const exposureType = route.params?.exposureType;
  const timestamp = route.params?.timestamp;
  const i18n = useI18n();
  const {ignoreOutbreak} = useOutbreakService();
  const [clearExposedStatus] = useClearExposedStatus();
  const [removeFromExposureHistory] = useRemoveFromExposureHistory();

  const {proximityExposureHistory, ignoreProximityExposure} = useDisplayExposureHistory();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.navigate('Menu'), [navigation]);
  const popAlert = () => {
    Alert.alert(i18n.translate('RecentExposures.Alert.Title'), i18n.translate('RecentExposures.Alert.Body'), [
      {
        text: i18n.translate('RecentExposures.Alert.Cancel'),
        onPress: () => {},
      },
      {
        text: i18n.translate('RecentExposures.Alert.Confirm'),
        onPress: deleteExposure,
        style: 'cancel',
      },
    ]);
  };

  const deleteExposure = () => {
    if (route.params?.historyItem === undefined) {
      log.error({category: 'qr-code', message: 'outbreak history item not defined'});
      return;
    }
    const historyItem = route.params.historyItem;
    if (exposureType === ExposureType.Outbreak) {
      ignoreOutbreak(historyItem.id);
      log.debug({
        category: 'debug',
        message: `clearing ${exposureType} exposure with id: ${historyItem.id}`,
      });
    } else if (exposureType === ExposureType.Proximity) {
      if (proximityExposureHistory.length === 1) {
        // if nothing left in displayProximityHistory, do the clear all thing
        ignoreProximityExposure(historyItem.id);
        clearExposedStatus();
      } else {
        // if there are still valid entries in displayProximityHistory, just remove the one timestamp from
        // home screen
        ignoreProximityExposure(historyItem.id);
        removeFromExposureHistory(historyItem.notificationTimestamp);
      }

      log.debug({
        category: 'debug',
        message: `clearing ${exposureType} exposure with id: ${historyItem.id}`,
      });
    }
    navigation.navigate('ExposureHistoryScreen', {refreshAt: getCurrentDate().getTime()});
  };

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <ToolbarWithClose closeText={i18n.translate('DataUpload.Close')} showBackButton onClose={close} />
        <ScrollView style={styles.flex}>
          <Box style={styles.zindex} width="100%" justifyContent="flex-start" marginBottom="-l">
            <Box style={styles.primaryIconStyles}>
              <Icon name="hand-caution" height={120} width={150} />
            </Box>
          </Box>
          <Box marginHorizontal="m">
            <ExposureContent exposureType={exposureType} timestamp={timestamp} />
            <Box marginTop="m">
              <ButtonSingleLine
                iconName="icon-chevron"
                variant="opaqueGrey"
                text={i18n.translate('RecentExposures.DeleteExposure')}
                onPress={popAlert}
              />
            </Box>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  zindex: {
    zIndex: 1,
  },
  primaryIconStyles: {
    marginLeft: -35,
    marginBottom: 32,
  },
});
