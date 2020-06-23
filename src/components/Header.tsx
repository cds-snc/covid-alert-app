import React, {useCallback} from 'react';
import {TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {Theme} from 'shared/theme';

import {Box} from './Box';
import {Icon} from './Icon';
import {Text} from './Text';

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
      <Box
        maxHeight={30}
        // borderWidth={2}
        // borderColor="bodyText"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <Icon size={129} name="stop-covid" />
      </Box>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginTop: -10,
  },
});
