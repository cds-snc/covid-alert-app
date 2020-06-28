import React, {useEffect, useState} from 'react';
import {Box, Text, Button, Header} from 'components';
import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';
import {Region} from 'shared/Region';
import {useNavigation} from '@react-navigation/native';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';

import {regionStyles} from './RegionPickerShared';

import {RegionPickerScreen} from '.';

interface LandingContentProps {
  showPicker: () => void;
}

const LandingContent = ({showPicker}: LandingContentProps) => {
  const [i18n] = useI18n();

  const {setRegion: persistRegion} = useStorage();
  const [selectedRegion] = useState<Region>('None');
  const navigation = useNavigation();
  const {setOnboarded} = useStorage();

  const startExposureNotificationService = useStartExposureNotificationService();
  useEffect(() => {
    startExposureNotificationService();
  }, [startExposureNotificationService]);

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={regionStyles.flex}>
        <Header />
        <ScrollView style={regionStyles.flex} contentContainerStyle={styles.content}>
          <Box flex={1} paddingHorizontal="m" paddingTop="m">
            <Box>
              <Text marginBottom="s" variant="bodyTitle" color="overlayBodyText" accessibilityRole="header">
                {i18n.translate('RegionLanding.Title')}
              </Text>
            </Box>
            <Box marginBottom="m">
              <Text variant="bodyText" color="overlayBodyText">
                {i18n.translate('RegionLanding.Body1')}
              </Text>
            </Box>
            <Box marginBottom="m">
              <Text variant="bodyText" color="overlayBodyText">
                {i18n.translate('RegionLanding.Body2')}
              </Text>
            </Box>
          </Box>

          <Box paddingHorizontal="m">
            <Button variant="thinFlat" text={i18n.translate('RegionLanding.RegionSelectBtn')} onPress={showPicker} />
          </Box>

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
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

export const RegionLandingScreen = () => {
  const [showRegionPicker, setShowRegionPicker] = useState(false);

  if (showRegionPicker) {
    return <RegionPickerScreen />;
  }

  return (
    <LandingContent
      showPicker={() => {
        setShowRegionPicker(true);
      }}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
