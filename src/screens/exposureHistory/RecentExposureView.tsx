import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {ToolbarWithClose} from 'components';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import {ExposureType} from 'shared/qr';
import {OutbreakExposedView} from 'screens/home/views/OutbreakExposedView';
import {ProximityExposureView} from 'screens/home/views/ProximityExposureView';

import {MainStackParamList} from '../../navigation/MainNavigator';

type RecentExposureScreenProps = RouteProp<MainStackParamList, 'RecentExposureScreen'>;

const ExposureView = () => {
  const route = useRoute<RecentExposureScreenProps>();
  if (!route.params?.id || !route.params?.exposureType) {
    return null;
  }
  const id = route.params.id;
  if (route.params.exposureType === ExposureType.Outbreak) {
    return <OutbreakExposedView id={id} />;
  }
  if (route.params.exposureType === ExposureType.Proximity) {
    return <ProximityExposureView />;
  }
  return null;
};

export const RecentExposureScreen = () => {
  const i18n = useI18n();

  const navigation = useNavigation();
  const close = useCallback(() => navigation.navigate('Home'), [navigation]);
  return (
    <SafeAreaView style={styles.flex}>
      <ToolbarWithClose closeText={i18n.translate('DataUpload.Close')} showBackButton onClose={close} />
      <ScrollView style={styles.flex}>
        <ExposureView />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
