import React, {useCallback} from 'react';
import {Box, Text} from 'components';
import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';
import {BackButton, NextButton, StepText} from 'screens/onboarding/components';
import {useNavigation} from '@react-navigation/native';
import {useStartExposureNotificationService} from 'services/ExposureNotificationService';

import {regionData, RegionItem, regionStyles} from './RegionPickerShared';

export const RegionPickerScreen = () => {
  const [i18n] = useI18n();
  const {region, setRegion, setOnboarded, setOnboardedDatetime} = useStorage();

  const navigation = useNavigation();
  const startExposureNotificationService = useStartExposureNotificationService();
  startExposureNotificationService();
  const onBack = useCallback(async () => {
    await setRegion(undefined);
    navigation.goBack();
  }, [navigation, setRegion]);
  const onNext = useCallback(async () => {
    await setOnboarded(true);
    await setOnboardedDatetime(new Date());
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  }, [navigation, setOnboarded, setOnboardedDatetime]);
  const isRegionSet = Boolean(region && region !== 'None');

  return (
    <Box flex={1} backgroundColor="overlayBackground">
      <SafeAreaView style={styles.flex}>
        <BackButton onBack={onBack} />
        <Box flex={1} paddingTop="s" justifyContent="center">
          <ScrollView style={regionStyles.flex}>
            <Box flex={1} paddingHorizontal="xl">
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
          <Box height={5} maxHeight={2} borderTopWidth={2} borderTopColor="gray5" />
          <StepText index={6} />
          <NextButton onNext={onNext} isEnd isRegionSet={isRegionSet} />
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
