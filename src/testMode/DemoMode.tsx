import React, {useCallback, useMemo} from 'react';
import {createDrawerNavigator, DrawerContentScrollView} from '@react-navigation/drawer';
import {useI18n} from 'locale';
import PushNotification from 'bridge/PushNotification';
import {Box, Button, LanguageToggle, Text} from 'components';
import {useStorage} from 'services/StorageService';
import {
  useExposureNotificationService,
  useExposureStatus,
  useReportDiagnosis,
} from 'services/ExposureNotificationService';
import {captureMessage} from 'shared/log';
import {TEST_MODE} from 'env';

import {RadioButton} from './components/RadioButtons';
import {MockProvider} from './MockProvider';
import {Item} from './views/Item';
import {Section} from './views/Section';

const Drawer = createDrawerNavigator();

const ScreenRadioSelector = () => {
  const {forceScreen, setForceScreen} = useStorage();
  const screenData = [
    {displayName: 'None', value: 'None'},
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

const DrawerContent = () => {
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

  return (
    <DrawerContentScrollView>
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
          <Button
            text="Force upload keys"
            variant="bigFlat"
            onPress={async () => {
              captureMessage('Force upload keys');
              fetchAndSubmitKeys();
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
              exposureNotificationService.exposureStatus.set({type: 'monitoring'});
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
      </Box>
    </DrawerContentScrollView>
  );
};

export interface DemoModeProps {
  children?: React.ReactElement;
}

export const DemoMode = ({children}: DemoModeProps) => {
  const drawerContent = useCallback(() => <DrawerContent />, []);
  const Component = useMemo(() => {
    const Component = () => {
      return <>{children}</>;
    };
    return Component;
  }, [children]);

  // disable the drawer if TEST_MODE === false
  return (
    <MockProvider>
      <Drawer.Navigator drawerPosition="right" drawerContent={drawerContent}>
        <Drawer.Screen name="main" component={Component} options={TEST_MODE ? {} : {gestureEnabled: false}} />
      </Drawer.Navigator>
    </MockProvider>
  );
};
