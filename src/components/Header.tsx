import React, {useCallback} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';

import {Box} from './Box';
import {Icon} from './Icon';
import {Text} from './Text';

export interface HeaderProps {
  isOverlay?: boolean;
}

export const Header = ({isOverlay}: HeaderProps) => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const onLogoPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);
  return (
    <TouchableWithoutFeedback onPress={onLogoPress}>
      <Box flexDirection="row" alignItems="center" justifyContent="center" marginBottom="l">
        <Box marginHorizontal="s">
          <Icon size={20} name="shield-covid" />
        </Box>
        <Text variant="homeHeader" color={isOverlay ? 'overlayBodyText' : 'bodyText'}>
          {i18n.translate('Home.AppName')}
        </Text>
      </Box>
    </TouchableWithoutFeedback>
  );
};
