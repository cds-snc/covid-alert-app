import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Toolbar, Text} from 'components';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStorage} from 'services/StorageService';
import {useI18n} from '@shopify/react-i18n';
import {Region} from 'shared/Region';

import {regionData, RegionItem, regionStyles} from './RegionPickerShared';

export const RegionPickerSettingsScreen = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const {region, setRegion} = useStorage();

  const close = useCallback(() => navigation.goBack(), [navigation]);
  const toggle = useCallback(
    (_region: Region) => () => {
      setRegion(_region);
    },
    [setRegion],
  );
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
          <Text paddingHorizontal="l" marginVertical="m" variant="bodyText" color="overlayBodyText">
            {i18n.translate('RegionPicker.Body')}
          </Text>
          <Box flex={1} paddingHorizontal="m">
            <Box
              marginTop="l"
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
                    onPress={toggle(item.code)}
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
