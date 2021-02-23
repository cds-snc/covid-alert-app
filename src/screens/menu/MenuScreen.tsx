import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Box, ButtonWrapper, Icon} from 'components';
import {SafeAreaView, ScrollView} from 'react-native';
import {StatusHeaderView} from 'screens/home/views/StatusHeaderView';
import {useSystemStatus, SystemStatus} from 'services/ExposureNotificationService';
import {InfoShareView} from './components/InfoShareView';

import {ConditionalMenuPanels} from './views/ConditionalMenuPanels';
import {PrimaryMenuButtons} from './views/PrimaryMenuButtons';

export const MenuScreen = () => {
  const [systemStatus] = useSystemStatus();
  const navigation = useNavigation();
  const close = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);
  return (
    <SafeAreaView>
      <ScrollView>
        <Box backgroundColor="overlayBackground">
          <Box flexDirection="row" marginTop="m" marginHorizontal="m">
            <Box marginVertical="m" flex={1}>
              <StatusHeaderView enabled={systemStatus === SystemStatus.Active} />
            </Box>
            <ButtonWrapper onPress={close} color="infoBlockNeutralBackground">
              <Box padding="s">
                <Icon name="close" size={20} />
              </Box>
            </ButtonWrapper>
          </Box>

          <PrimaryMenuButtons />

          <ConditionalMenuPanels />

          <Box marginBottom="m" marginHorizontal="m">
            <InfoShareView />
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};
