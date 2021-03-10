import React, {useCallback, useState, useEffect} from 'react';
import {TextInput, StyleSheet, ScrollView} from 'react-native';
import {Switch} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useI18n} from 'locale';
import PushNotification from 'bridge/PushNotification';
import {Box, Button, LanguageToggle, Text, Toolbar} from 'components';
import {useCachedStorage} from 'services/StorageService';
import {
  ExposureStatusType,
  useExposureNotificationService,
  useReportDiagnosis,
  useUpdateExposureStatus,
} from 'services/ExposureNotificationService';
import {APP_VERSION_NAME, APP_VERSION_CODE} from 'env';
import {captureMessage} from 'shared/log';
import {useNavigation} from '@react-navigation/native';
import {ContagiousDateType} from 'shared/DataSharing';
import {getLogUUID, setLogUUID} from 'shared/logging/uuid';
import {ForceScreen} from 'shared/ForceScreen';
import {useOutbreakService} from 'shared/OutbreakProvider';
import {PollNotifications} from 'services/PollNotificationService';
import {FilteredMetricsService} from 'services/MetricsService/FilteredMetricsService';
import {log} from 'shared/logging/config';

import {RadioButton} from './components/RadioButtons';
import {MockProvider} from './MockProvider';
import {Item} from './views/Item';
import {Section} from './views/Section';

const ScreenRadioSelector = () => {
  const {forceScreen, setForceScreen} = useCachedStorage();
  const forceScreenOnPress = (value: string) => {
    if (Object.values(ForceScreen).includes(value as ForceScreen)) {
      setForceScreen(value as ForceScreen);
    }
  };
  const screenData = [
    {displayName: 'None', value: ForceScreen.None},
    {displayName: 'Not Exposed', value: ForceScreen.NoExposureView},
    {displayName: 'Exposed', value: ForceScreen.ExposureView},
    {displayName: 'Diagnosed Share Data', value: ForceScreen.DiagnosedShareView},
    {displayName: 'Diagnosed', value: ForceScreen.DiagnosedView},
    {displayName: 'Diagnosed Share Upload', value: ForceScreen.DiagnosedShareUploadView},
    {displayName: 'Unsupported Framework', value: ForceScreen.FrameworkUnavailableView},
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
            onPress={forceScreenOnPress}
            name={x.displayName}
            value={x.value}
          />
        );
      })}
    </Box>
  );
};

const SkipAllSetRadioSelector = () => {
  const {skipAllSet, setSkipAllSet} = useCachedStorage();
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
  const navigation = useNavigation();

  const {reset, qrEnabled, setQrEnabled} = useCachedStorage();
  const {checkForOutbreaks, clearOutbreakHistory} = useOutbreakService();
  const [toggleState, setToggleState] = useState<boolean>(qrEnabled);
  const onClearOutbreak = useCallback(async () => {
    clearOutbreakHistory();
  }, [clearOutbreakHistory]);

  const onCheckForOutbreak = useCallback(async () => {
    checkForOutbreaks(true);
  }, [checkForOutbreaks]);

  const goToCheckInHistory = useCallback(() => navigation.navigate('CheckInHistoryScreen'), [navigation]);

  const onShowSampleNotification = useCallback(() => {
    PushNotification.presentLocalNotification({
      alertTitle: i18n.translate('Notification.ExposedMessageTitle'),
      alertBody: i18n.translate('Notification.ExposedMessageBody'),
      channelName: i18n.translate('Notification.AndroidChannelName'),
    });
  }, [i18n]);

  const onClearReadReceipts = useCallback(() => {
    PollNotifications.clearNotificationReceipts();
  }, []);

  const onPollNotifications = useCallback(async () => {
    await PollNotifications.checkForNotifications(i18n);
  }, [i18n]);

  const onDebugMetrics = useCallback(async () => {
    const payload = await FilteredMetricsService.sharedInstance().retrieveAllMetricsInStorage();
    log.debug({
      category: 'metrics',
      message: 'debug metrics',
      payload,
    });
  }, []);

  const exposureNotificationService = useExposureNotificationService();
  const updateExposureStatus = useUpdateExposureStatus();

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
        <Text
          testID="DemoMenu"
          paddingLeft="m"
          paddingRight="m"
          fontWeight="bold"
          paddingBottom="s"
          color="overlayBodyText"
        >
          Demo menu
        </Text>
      </Section>

      <Section>
        <Button text="Debug Metrics" onPress={onDebugMetrics} variant="bigFlat" />
      </Section>
      <Section>
        <Button
          text="Show sample notification"
          onPress={onShowSampleNotification}
          variant="bigFlat"
          testID="ShowSampleNotification"
        />
      </Section>
      <Section>
        <Button text="Poll for notifications" onPress={onPollNotifications} variant="bigFlat" />
      </Section>
      <Section>
        <Button
          text="Clear notification receipts"
          onPress={onClearReadReceipts}
          variant="bigFlat"
          testID="ClearNotificationReceipts"
        />
      </Section>
      <Section>
        <Box flexDirection="row">
          <Box flex={1}>
            <Text paddingLeft="m" paddingRight="m" paddingBottom="s" color="overlayBodyText">
              QR Feature
            </Text>
          </Box>
          <Switch
            onValueChange={() => {
              setQrEnabled(!toggleState);
              setToggleState(!toggleState);
            }}
            value={toggleState}
          />
        </Box>
      </Section>
      {qrEnabled && (
        <>
          <Section>
            <Button text="Check for Outbreak Exposures" onPress={onCheckForOutbreak} variant="bigFlat" />
          </Section>
          <Section>
            <Button text="Clear Outbreak Exposures" onPress={onClearOutbreak} variant="bigFlat" />
          </Section>
          <Section>
            <Button text="Check-in History" variant="bigFlat" onPress={goToCheckInHistory} />
          </Section>
        </>
      )}
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
            fetchAndSubmitKeys({dateType: ContagiousDateType.None, date: null});
          }}
        />
      </Section>
      <Section>
        <Button
          text="Clear exposure history"
          variant="bigFlat"
          onPress={async () => {
            captureMessage('Clear exposure history');
            exposureNotificationService.exposureStatusUpdatePromise = null;
            exposureNotificationService.exposureStatus.set({type: ExposureStatusType.Monitoring});
          }}
        />
      </Section>
      <Section>
        <Button
          text="Force exposure check"
          variant="bigFlat"
          onPress={async () => {
            updateExposureStatus(true);
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
