import React, {useCallback, useMemo, useState} from 'react';
import {createDrawerNavigator, DrawerContentScrollView} from '@react-navigation/drawer';
import {useI18n} from '@shopify/react-i18n';
import PushNotification from 'bridge/PushNotification';
import {Box, Text} from 'components';
import {SystemStatus, useSystemStatus, useExposureStatus} from 'services/ExposureNotificationService';
import {useStorage} from 'services/StorageService';
import {ExposureSummary} from 'bridge/ExposureNotification';
import AsyncStorage from '@react-native-community/async-storage';

import {MockProvider, useMock} from './MockProvider';
import {Item} from './views/Item';
import {Section} from './views/Section';

const Drawer = createDrawerNavigator();

const DrawerContent = () => {
  const [i18n] = useI18n();

  const {reset} = useStorage();

  const onShowSampleNotification = useCallback(() => {
    PushNotification.presentLocalNotification({
      alertTitle: i18n.translate('Notification.ExposedMessageTitle'),
      alertBody: i18n.translate('Notification.ExposedMessageBody'),
    });
  }, [i18n]);

  const mock = useMock();
  const onToggleMockEnabled = useCallback(() => {
    mock.setEnabled(!mock.enabled);
  }, [mock]);

  const [systemStatus, updateSystemStatus] = useSystemStatus();
  const onToggleSystemStatus = useCallback(() => {
    const newStatus = systemStatus === SystemStatus.Active ? SystemStatus.Disabled : SystemStatus.Active;
    mock.exposureNotification.setStatus(newStatus);
    updateSystemStatus();
  }, [mock, systemStatus, updateSystemStatus]);

  const [exposureStatus, updateExposureStatus] = useExposureStatus();
  const onToggleExposureStatus = useCallback(() => {
    let newExposureSummary: ExposureSummary;
    switch (exposureStatus.type) {
      case 'monitoring':
        // Change to exposed
        newExposureSummary = {
          daysSinceLastExposure: Date.now(),
          matchedKeyCount: 1,
          maximumRiskScore: 8,
        };
        break;
      default:
        // Change to monitoring
        newExposureSummary = {
          daysSinceLastExposure: 0,
          matchedKeyCount: 0,
          maximumRiskScore: 0,
        };
        break;
    }
    mock.exposureNotification.setExposureSummary(newExposureSummary);
    updateExposureStatus();
  }, [exposureStatus.type, mock.exposureNotification, updateExposureStatus]);

  const [claimOneTimeCodeResponse, setClaimOneTimeCodeResponse] = useState(mock.backend.claimOneTimeCodeResponse);
  const onToggleClaimOneTimeCodeResponse = useCallback(() => {
    setClaimOneTimeCodeResponse(currentStatus => {
      const shouldSuccess = !currentStatus;
      mock.backend.claimOneTimeCodeResponse = shouldSuccess;
      return shouldSuccess;
    });
  }, [mock.backend]);

  return (
    <DrawerContentScrollView>
      <Box>
        <Section>
          <Text paddingLeft="m" paddingRight="m" fontWeight="bold" paddingBottom="s" color="overlayBodyText">
            Test menu
          </Text>
        </Section>
        <Section>
          <Item title="Show sample notification" onPress={onShowSampleNotification} />
        </Section>
        <Section>
          <Item
            title="Mock server"
            onPress={onToggleMockEnabled}
            connectedRight={mock.enabled ? 'enabled' : 'disabled'}
          />
          {mock.enabled && (
            <>
              <Item title="System status" onPress={onToggleSystemStatus} connectedRight={systemStatus} />
              <Item title="Expose status" onPress={onToggleExposureStatus} connectedRight={exposureStatus.type} />
              <Item
                title="Claim OneTimeCode Response"
                onPress={onToggleClaimOneTimeCodeResponse}
                connectedRight={claimOneTimeCodeResponse ? 'diagnosed' : 'none'}
              />
            </>
          )}
        </Section>
        {!mock.enabled && (
          <>
            <Section>
              <Item
                title="Clear exposure history and run check"
                onPress={async () => {
                  console.log('forcing refresh...');
                  await AsyncStorage.removeItem('lastCheckTimeStamp');
                  updateExposureStatus();
                }}
              />
            </Section>
          </>
        )}
        <Section>
          <Item title="JavaScript engine" connectedRight={(global as any).HermesInternal == null ? 'JSC' : 'Hermes'} />
        </Section>
        <Section>
          <Item title="Clear data" onPress={reset} />
        </Section>
      </Box>
    </DrawerContentScrollView>
  );
};

export interface TestModeProps {
  children?: React.ReactElement;
}

export const TestMode = ({children}: TestModeProps) => {
  const drawerContent = useCallback(() => <DrawerContent />, []);
  const Component = useMemo(() => {
    const Component = () => {
      return <>{children}</>;
    };
    return Component;
  }, [children]);

  return (
    <MockProvider>
      <Drawer.Navigator drawerPosition="right" drawerContent={drawerContent}>
        <Drawer.Screen name="main" component={Component} />
      </Drawer.Navigator>
    </MockProvider>
  );
};
