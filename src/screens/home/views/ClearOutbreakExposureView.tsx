import React, { useCallback } from 'react';
import { ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Box, Button, ButtonSingleLine, Toolbar } from 'components';
import { useNavigation } from '@react-navigation/native';
import { OutbreakStatusType } from 'shared/qr';
import { useOutbreakService } from 'shared/OutbreakProvider'
import { getCurrentDate } from 'shared/date-fns';

export const ClearOutbreakExposureScreen = () => {
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const { setOutbreakStatus } = useOutbreakService();
  const onClearOutbreak = useCallback(async () => {
    setOutbreakStatus({
      type: OutbreakStatusType.Monitoring,
      lastChecked: getCurrentDate().getTime(),
    });
  }, [setOutbreakStatus]);
  const onClearOutbreakExposed = useCallback(() => {
    Alert.alert(
      'Are you sure you want to clear outbreak exposure history?',
      undefined,
      [
        {
          text: 'Confirm',
          onPress: () => {
            onClearOutbreak();
            close();
          }
        },
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel'
        }
      ]
    )
  }, [onClearOutbreak]);

  return (
    <Box backgroundColor="overlayBackground" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Toolbar
          title=""
          navIcon="icon-back-arrow"
          navText="Close"
          navLabel="Close"
          onIconClicked={close}
        />
        <ScrollView>
          <Box paddingHorizontal="m" paddingBottom="l">
            <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
              Clear Outbreak Exposure History
            </Text>
            <Text marginBottom="m">If you have recieved a negative test result, you may clear your outbreak exposure history</Text>

            <Button
              text="Clear Exposure"
              onPress={onClearOutbreakExposed}
              variant="thinFlat" />
          </Box>
        </ScrollView>
      </SafeAreaView>

    </Box>
  )
}


export const NegativeOutbreakTestButton = () => {

  const navigation = useNavigation();

  const toClearOutbreakExposure = useCallback(() => navigation.navigate('ClearOutbreakExposure'), [navigation]);

  return (
    <Box>
      <Box alignSelf="stretch">
        <ButtonSingleLine
          iconName="icon-chevron"
          text="Clear Outbreak Exposure"
          onPress={toClearOutbreakExposure}
          variant="exposure25"
        />
      </Box>
    </Box>
  )
}
