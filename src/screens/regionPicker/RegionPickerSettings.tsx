import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Toolbar, Text, TextMultiline} from 'components';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStorage} from 'services/StorageService';
import {useI18n} from 'locale';
import {Region} from 'shared/Region';

import {regionData, RegionItem, regionStyles} from './RegionPickerShared';

export const RegionPickerSettingsScreen = () => {
  const i18n = useI18n();
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
          title=""
          navIcon="icon-back-arrow"
          navText={i18n.translate('RegionPicker.Close')}
          navLabel={i18n.translate('RegionPicker.Close')}
          onIconClicked={close}
        />
        <ScrollView style={regionStyles.flex}>
          <Text
            paddingHorizontal="m"
            marginBottom="m"
            variant="bodyTitle"
            color="bodyText"
            accessibilityRole="header"
            accessibilityAutoFocus
          >
            {i18n.translate('RegionPicker.SettingsTitle')}
          </Text>
          <TextMultiline
            paddingHorizontal="m"
            marginVertical="s"
            variant="bodyText"
            color="overlayBodyText"
            text={i18n.translate('RegionPicker.Body')}
          />
          <Box flex={1} paddingHorizontal="m" marginBottom="m">
            <Box marginTop="l" paddingHorizontal="m" borderRadius={10} overflow="hidden" accessibilityRole="radiogroup">
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
