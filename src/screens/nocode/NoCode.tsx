import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Toolbar} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {useStorage} from 'services/StorageService';
import {getRegionCase} from 'shared/RegionLogic';
import {SafeAreaView} from 'react-native-safe-area-context';

import {NoRegionView} from './views/NoRegionView';
import {RegionNotCoveredView} from './views/RegionNotCoveredView';
import {ONView} from './views/ONView';
import {NLView} from './views/NLView';

const Content = () => {
  const {region} = useStorage();
  const regionCase = getRegionCase(region);
  switch (regionCase) {
    case 'regionNotCovered':
      return <RegionNotCoveredView />;
    case 'regionCovered':
      if (region === 'NL') {
        return <NLView />;
      } else if (region === 'ON') {
        return <ONView />;
      }
      return <RegionNotCoveredView />;
    default:
      return <NoRegionView />;
  }
};

export const NoCodeScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <Toolbar
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('DataUpload.Cancel')}
          navLabel={i18n.translate('DataUpload.Cancel')}
          onIconClicked={close}
        />
        <ScrollView style={styles.flex}>
          <Box paddingHorizontal="m" paddingBottom="l">
            <Content />
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
});
