import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, ToolbarWithClose, Text, TextMultiline} from 'components';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCachedStorage} from 'services/StorageService';
import {useI18n} from 'locale';
import {Region} from 'shared/Region';
import styles from 'shared/Styles';

import {regionData, RegionItem} from './RegionPickerShared';

export const RegionPickerSettingsScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const {region, setRegion} = useCachedStorage();

  const close = useCallback(() => navigation.goBack(), [navigation]);
  const toggle = useCallback(
    (_region: Region) => () => {
      setRegion(_region);
    },
    [setRegion],
  );
  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <ToolbarWithClose closeText={i18n.translate('RegionPicker.Close')} showBackButton={false} onClose={close} />
        <ScrollView style={styles.flex} testID="RegionPickerSettings-ScrollView">
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
                    testID={`RegionPickerSettings-${item.code}`}
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
