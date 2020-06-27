import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, Text, Button} from 'components';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useStorage} from 'services/StorageService';
import {useI18n} from '@shopify/react-i18n';
import {Region} from 'shared/Region';

import {regionStyles} from './RegionPickerShared';

export const RegionLandingScreen = () => {
  const [i18n] = useI18n();
  const {setRegion: persistRegion} = useStorage();
  const [selectedRegion] = useState<Region>('None');
  const navigation = useNavigation();
  const {setOnboarded} = useStorage();

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={regionStyles.flex}>
        <ScrollView style={regionStyles.flex}>
          <Box flex={1} paddingHorizontal="m" paddingTop="m">
            <Text marginBottom="s" variant="bodyTitle" color="overlayBodyText" accessibilityRole="header">
              {i18n.translate('RegionLanding.Title')}
            </Text>
          </Box>
        </ScrollView>
        <Box
          backgroundColor="overlayBackground"
          padding="m"
          shadowColor="infoBlockNeutralBackground"
          shadowOffset={{width: 0, height: 2}}
          shadowOpacity={0.5}
          shadowRadius={2}
          elevation={10}
        >
          <Button
            text={i18n.translate(`RegionPicker.${selectedRegion === 'None' ? 'Skip' : 'GetStarted'}`)}
            variant={selectedRegion === 'None' ? 'thinFlatNeutralGrey' : 'thinFlat'}
            onPress={async () => {
              await setOnboarded(true);
              await persistRegion(selectedRegion);
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              });
            }}
          />
        </Box>
      </SafeAreaView>
    </Box>
  );
};
