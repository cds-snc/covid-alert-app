import React, {useCallback, useState, useEffect} from 'react';
import {TextInput, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from 'locale';
import PushNotification from 'bridge/PushNotification';
import {Box, Button, LanguageToggle, Text, Toolbar} from 'components';
import {useStorage} from 'services/StorageService';
import {
  ExposureStatusType,
  useExposureNotificationService,
  useExposureStatus,
  useReportDiagnosis,
} from 'services/ExposureNotificationService';
import {APP_VERSION_NAME, APP_VERSION_CODE} from 'env';
import {setLogUUID, getLogUUID, captureMessage} from 'shared/log';
import {useNavigation} from '@react-navigation/native';

import {RadioButton} from './components/RadioButtons';
import {MockProvider} from './MockProvider';
import {Item} from './views/Item';
import {Section} from './views/Section';

const ScreenRadioSelector = () => {
  const {forceScreen, setForceScreen} = useStorage();
  const screenData = [
    {displayName: 'None', value: 'None'},
    {displayName: 'Not Exposed', value: 'NoExposureView'},
    {displayName: 'Exposed', value: 'ExposureView'},
    {displayName: 'Diagnosed Share Data', value: 'DiagnosedShareView'},
  ];
  return (
    <Box
      marginTop="l"
      paddingHorizontal="m"
      borderRadius={10}
      backgroundColor="infoBlockNeutralBackground"
      accessibilityRole="radiogroup"
    >
      {screenData.map(x => {
        return (
          <RadioButton
            testID={x.value}
            key={x.displayName}
            selected={forceScreen === x.value}
            onPress={setForceScreen}
            name={x.displayName}
            value={x.value}
          />
        );
      })}
    </Box>
  );
};

const SkipAllSetRadioSelector = () => {
  const {skipAllSet, setSkipAllSet} = useStorage();
  const screenData = [
    {displayName: 'False', value: 'false'},
    {displayName: 'True', value: 'true'},
  ];

  return (
    <Box
      marginTop="l"
      paddingHorizontal="m"
      borderRadius={10}
      backgroundColor="infoBlockNeutralBackground"
      accessibilityRole="radiogroup"
    >
      {screenData.map(x => {
        return (
          <RadioButton
            testID={`allSetToggle-${x.value}`}
            key={x.displayName}
            selected={skipAllSet.toString() === x.value}
            onPress={val => {
              setSkipAllSet(val === 'true');
            }}
            name={x.displayName}
            value={x.value}
          />
        );
      })}
    </Box>
  );
};

const Content = () => {
  const i18n = useI18n();

  const {reset} = useStorage();

  const onShowSampleNotification = useCallback(() => {
    PushNotification.presentLocalNotification({
      alertTitle: i18n.translate('Notification.ExposedMessageTitle'),
      alertBody: i18n.translate('Notification.ExposedMessageBody'),
    });
  }, [i18n]);

  const exposureNotificationService = useExposureNotificationService();
  const [, updateExposureStatus] = useExposureStatus();

  const {fetchAndSubmitKeys} = useReportDiagnosis();

  const [UUID, setUUID] = useState('');
  const onApplyUUID = useCallback(() => {
    setLogUUID(UUID);
  }, [UUID]);

  useEffect(() => {
    (async () => {
      setUUID(await getLogUUID());
    })();
  }, []);

  return (
    <Box marginHorizontal="m">
      <Section>
        <Text paddingLeft="m" paddingRight="m" fontWeight="bold" paddingBottom="s" color="overlayBodyText">
          Demo menu
        </Text>
      </Section>
      <Section>
        <Button text="Show sample notification" onPress={onShowSampleNotification} variant="bigFlat" />
      </Section>
      <Section>
        <Item title="Force screen" />
        <ScreenRadioSelector />
      </Section>
      <Section>
        <Item title="Skip 'You're all set'" />
        <SkipAllSetRadioSelector />
      </Section>
      <Section>
        <Item title="UUID for debugging" />
        <Box flexDirection="row">
          <TextInput style={styles.uuidTextInput} placeholder="UUID..." value={UUID} onChangeText={setUUID} />
          <Button variant="thinFlat" text="Apply" onPress={onApplyUUID} />
        </Box>
      </Section>
      <Section>
        <Button
          text="Force upload keys"
          variant="bigFlat"
          onPress={async () => {
            captureMessage('Force upload keys');
            fetchAndSubmitKeys({dateType: 'noDate', dateString: ''});
          }}
        />
      </Section>
      <Section>
        <Button
          text="Clear exposure history and run check"
          variant="bigFlat"
          onPress={async () => {
            captureMessage('Forcing refresh...');
            exposureNotificationService.exposureStatusUpdatePromise = null;
            exposureNotificationService.exposureStatus.set({type: ExposureStatusType.Monitoring});
            updateExposureStatus();
          }}
        />
      </Section>
      <Section>
        <LanguageToggle />
      </Section>
      <Section>
        <Button text="Clear data" onPress={reset} variant="danger50Flat" />
      </Section>
      <Section>
        <Item title={`Version: ${APP_VERSION_NAME} (${APP_VERSION_CODE})`} />
      </Section>
    </Box>
  );
};

export const TestScreen = () => {
  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <MockProvider>
      <Box backgroundColor="overlayBackground" flex={1}>
        <SafeAreaView style={styles.flex}>
          <Toolbar title="" navIcon="icon-back-arrow" navText="Close" onIconClicked={close} />
          <ScrollView style={styles.flex}>
            <Content />
          </ScrollView>
        </SafeAreaView>
      </Box>
    </MockProvider>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  uuidTextInput: {
    flex: 1,
    color: '#000000',
  },
});
