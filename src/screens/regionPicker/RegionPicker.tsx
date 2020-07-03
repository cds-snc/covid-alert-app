import React, {useCallback} from 'react';
import {Box, Text} from 'components';
import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';
import {BackButton} from 'screens/onboarding/components/BackButton';
import {useNavigation} from '@react-navigation/native';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';

import {regionData, RegionItem, regionStyles} from './RegionPickerShared';

export const RegionPickerScreen = () => {
  const [i18n] = useI18n();
  const {region, setRegion, setOnboarded, setOnboardedDatetime} = useStorage();

  const navigation = useNavigation();
  const startExposureNotificationService = useStartExposureNotificationService();
  startExposureNotificationService();

  const onNext = useCallback(async () => {
    await setOnboarded(true);
    await setOnboardedDatetime(new Date());
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  }, [navigation, setOnboarded, setOnboardedDatetime]);
  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <BackButton />
        <Box flex={1} paddingTop="s" justifyContent="center">
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
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
