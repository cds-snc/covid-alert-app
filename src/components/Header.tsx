import React, {useCallback} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';

import {Box} from './Box';
import {Icon} from './Icon';

export interface HeaderProps {
  isOverlay?: boolean;
}

export const Header = () => {
  const navigation = useNavigation();

  const onLogoPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);
  return (
    <TouchableWithoutFeedback onPress={onLogoPress}>
      <Box maxHeight={30} flexDirection="row" alignItems="center" justifyContent="center">
        <Icon size={129} name="stop-covid" />
      </Box>
    </TouchableWithoutFeedback>
  );
};
