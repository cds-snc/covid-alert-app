import React from 'react';
import {Box, Text} from 'components';
import {ScrollView} from 'react-native';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';

import {regionData, RegionItem, regionStyles} from './RegionPickerShared';

export const RegionPickerScreen = () => {
  const [i18n] = useI18n();
  const {region, setRegion} = useStorage();

  return (
    <Box style={regionStyles.flex} justifyContent="flex-start" backgroundColor="overlayBackground">
      <ScrollView style={regionStyles.flex}>
        <Box flex={1} paddingHorizontal="m">
          <Text marginBottom="s" variant="bodyTitle" color="overlayBodyText" accessibilityRole="header">
            {i18n.translate('RegionPicker.Title')}
          </Text>
          <Text marginVertical="m" variant="bodyText" color="overlayBodyText">
            {i18n.translate('RegionPicker.Body')}
          </Text>
          <Box
            marginTop="s"
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
                  onPress={async selectedRegion => {
                    setRegion(selectedRegion);
                  }}
                  name={i18n.translate(`RegionPicker.${item.code}`)}
                  {...item}
                />
              );
            })}
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
};
