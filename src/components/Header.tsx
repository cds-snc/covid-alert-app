import React, {useCallback} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';
import {Theme} from 'shared/theme';

import {Box} from './Box';
import {Icon} from './Icon';
import {Text} from './Text';

export interface HeaderProps {
  isOverlay?: boolean;
}

type Color = keyof Theme['colors'];

export const Header = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();

  const textColor = 'bodyText';

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
