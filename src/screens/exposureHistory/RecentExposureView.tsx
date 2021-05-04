import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {Box, Button, Icon, ToolbarWithClose} from 'components';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import {ExposureType} from 'shared/qr';

import {MainStackParamList} from '../../navigation/MainNavigator';

import {OutbreakExposureContent} from './views/OutbreakExposureContent';
import {ProximityExposureContent} from './views/ProximityExposureContent';

type RecentExposureScreenProps = RouteProp<MainStackParamList, 'RecentExposureScreen'>;

const ExposureContent = () => {
  const route = useRoute<RecentExposureScreenProps>();
  if (route.params.exposureType === ExposureType.Outbreak) {
    return <OutbreakExposureContent timestamp={route.params.timestamp} />;
  }
  if (route.params.exposureType === ExposureType.Proximity) {
    return <ProximityExposureContent timestamp={route.params.timestamp} />;
  }
  return null;
};

export const RecentExposureScreen = () => {
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
            <ExposureContent />
            <Box marginTop="m">
              <Button variant="opaqueGrey" text={i18n.translate('ExposureHistory.DeleteExposure')} onPress={() => {}} />
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
