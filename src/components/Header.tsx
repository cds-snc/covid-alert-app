import React, {useCallback} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';

import {Box} from './Box';
import {Icon} from './Icon';

export interface HeaderProps {
  isOverlay?: boolean;
}

export const Header = () => {
  const navigation = useNavigation();
  const [i18n] = useI18n();

  const onLogoPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  return (
    <TouchableWithoutFeedback onPress={onLogoPress}>
      <Box maxHeight={30} flexDirection="row" alignItems="center" justifyContent="center">
        {i18n.locale === 'fr' ? <Icon size={138} name="covid-alert-fr" /> : <Icon size={129} name="covid-alert-en" />}
      </Box>
    </TouchableWithoutFeedback>
  );
};
