import React, {useCallback} from 'react';
import {useI18n} from 'locale';
import {Box, Toolbar} from 'components';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';

import {OutbreakExposedView} from '../home/views/OutbreakExposedView';

export const RecentExposureScreen = () => {
  const i18n = useI18n();

  const navigation = useNavigation();
  const back = useCallback(() => navigation.goBack(), [navigation]);
  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <Toolbar title="" navIcon="icon-back-arrow" navText={i18n.translate('PlacesLog.Back')} onIconClicked={back} />
        <ScrollView style={styles.flex}>
          <OutbreakExposedView />
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
