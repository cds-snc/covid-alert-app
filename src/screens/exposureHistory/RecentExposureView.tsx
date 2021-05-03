import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {Toolbar2} from 'components';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';

import {OutbreakExposedView} from '../home/views/OutbreakExposedView';
import {MainStackParamList} from '../../navigation/MainNavigator';

type RecentExposureScreenProps = RouteProp<MainStackParamList, 'RecentExposureScreen'>;

const ExposureView = () => {
  const route = useRoute<RecentExposureScreenProps>();
  // @todo add proper type checking here -> exposureType
  if (route.params?.id && route.params?.exposureType === 'exposure') {
    const id = route.params.id;
    return <OutbreakExposedView id={id} />;
  }
  // @todo return proximity Exposure
  return null;
};

export const RecentExposureScreen = () => {
  const i18n = useI18n();

  const navigation = useNavigation();
  const close = useCallback(() => navigation.navigate('Home'), [navigation]);
  return (
    <SafeAreaView style={styles.flex}>
      <Toolbar2 navText={i18n.translate('DataUpload.Close')} showBackButton onIconClicked={close} />
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
