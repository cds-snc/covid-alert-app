import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Toolbar} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {useStorage} from 'services/StorageService';
import {getRegionCase} from 'shared/RegionLogic';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRegionalI18n} from 'locale/regional';

import {NoRegionView} from './views/NoRegionView';
import {RegionNotCoveredView} from './views/RegionNotCoveredView';
import {ActiveListView} from './views/ActiveListView';
import {ActiveParagraphView} from './views/ActiveParagraphView';

const Content = () => {
  const {region} = useStorage();
  const regionalI18n = useRegionalI18n();
  const regionCase = getRegionCase(region, regionalI18n.activeRegions);
  switch (regionCase) {
    case 'regionNotActive':
      return <RegionNotCoveredView />;
    case 'regionActive':
      if (region === 'ON') {
        return <ActiveListView />;
      }
      return <ActiveParagraphView />;
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
