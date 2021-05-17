import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {Box, Icon, ToolbarWithClose} from 'components';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import {ExposureType} from 'shared/qr';
import {MainStackParamList} from 'navigation/MainNavigator';

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
  const notificationTimestamp = route.params?.notificationTimestamp;
  const i18n = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.navigate('Menu'), [navigation]);

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
            <ExposureContent exposureType={exposureType} timestamp={notificationTimestamp} />
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
