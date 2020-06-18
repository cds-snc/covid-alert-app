import React, {useState, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Toolbar} from 'components';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStorage} from 'services/StorageService';
import {useI18n} from '@shopify/react-i18n';
import {Region} from 'shared/Region';
import {regionData, RegionItem, regionStyles} from './RegionPickerComponents';

export const RegionPickerSettingsScreen = () => {
  const [i18n] = useI18n();
  const {setRegion: persistRegion} = useStorage();
  const {region} = useStorage();
  const [_, setSelectedRegion] = useState<Region>('None');
  const navigation = useNavigation();
  const saveRegion = (region: Region) => {
    setSelectedRegion(region);
    persistRegion(region);
  };
  const close = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={regionStyles.flex}>
        <Toolbar
          title={i18n.translate('RegionPicker.SettingsTitle')}
          navIcon="icon-back-arrow"
          navText={i18n.translate('RegionPicker.Close')}
          navLabel={i18n.translate('RegionPicker.Close')}
          onIconClicked={close}
        />
        <ScrollView style={regionStyles.flex}>
          <Box flex={1} paddingHorizontal="m" paddingTop="m">
            <Box
              paddingHorizontal="m"
              borderRadius={10}
              backgroundColor="infoBlockNeutralBackground"
              accessibilityRole="radiogroup"
            >
              {regionData.map(item => {
                return (
                  <RegionItem
                    key={item.code}
                    selected={region === item.code}
                    onPress={saveRegion}
                    name={i18n.translate(`RegionPicker.${item.code}`)}
                    {...item}
                  />
                );
              })}
            </Box>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};
