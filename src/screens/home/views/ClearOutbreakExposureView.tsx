import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Box, Button, ButtonSingleLine, Toolbar } from 'components';
import { useNavigation } from '@react-navigation/native';
import { useI18n } from 'locale';
import { OutbreakStatusType } from 'shared/qr';
import { useOutbreakService } from 'shared/OutbreakProvider'
import { getCurrentDate } from 'shared/date-fns';

export const NegativeOutbreakTestButton = () => {
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
  const i18n = useI18n();

  return (
    <Box>
      <Box alignSelf="stretch">
        <ButtonSingleLine
          iconName="icon-chevron"
          text="Clear Outbreak Exposure"
          onPress={onClearOutbreakExposed}
          variant="exposure25"
        />
      </Box>
    </Box>
  )
}
