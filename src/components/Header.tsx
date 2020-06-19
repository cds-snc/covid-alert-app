import React, {useCallback} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';
import {getRegionCase} from 'shared/RegionLogic';
import {Theme} from 'shared/theme';
import {useNetInfo} from '@react-native-community/netinfo';
import {useSystemStatus, SystemStatus} from 'services/ExposureNotificationService';

import {Box} from './Box';
import {Icon} from './Icon';
import {Text} from './Text';

export interface HeaderProps {
  isOverlay?: boolean;
}

type Color = keyof Theme['colors'];

export const Header = ({isOverlay}: HeaderProps) => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const network = useNetInfo();
  const [systemStatus] = useSystemStatus();

  const {region} = useStorage();
  const regionCase = getRegionCase(region);

  let textColor = isOverlay ? 'overlayBodyText' : 'bodyText';

  if (regionCase === 'noRegionSet' || regionCase === 'regionNotCovered') {
    textColor = 'bodyTitleWhite';
  }

  if (!network.isConnected) {
    textColor = 'bodyText';
  }

  if (systemStatus === SystemStatus.Disabled || systemStatus === SystemStatus.Restricted) {
    textColor = 'bodyText';
  }
  const headerTextColor: Color = textColor as Color;

  const onLogoPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);
  return (
    <TouchableWithoutFeedback onPress={onLogoPress}>
      <Box flexDirection="row" alignItems="center" justifyContent="center" marginBottom="l">
        <Box marginHorizontal="s">
          <Icon size={20} name="maple-leaf" />
        </Box>

        <Text variant="homeHeader" color={headerTextColor}>
          {i18n.translate('Home.AppName')}
        </Text>
      </Box>
    </TouchableWithoutFeedback>
  );
};
