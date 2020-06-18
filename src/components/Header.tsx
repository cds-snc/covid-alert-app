import React, {useCallback} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';
import {getRegionCase} from 'shared/RegionLogic';

import {Box} from './Box';
import {Icon} from './Icon';
import {Text} from './Text';

export interface HeaderProps {
  isOverlay?: boolean;
}

export const Header = ({isOverlay}: HeaderProps) => {
  const [i18n] = useI18n();
  const navigation = useNavigation();

  const {region} = useStorage();
  const regionCase = getRegionCase(region);

  let textColor = isOverlay ? 'overlayBodyText' : 'bodyText';

  if (regionCase === 'noRegionSet') {
    textColor = 'bodyTitleWhite';
  }

  const onLogoPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);
  return (
    <TouchableWithoutFeedback onPress={onLogoPress}>
      <Box flexDirection="row" alignItems="center" justifyContent="center" marginBottom="l">
        <Box marginHorizontal="s">
          <Icon size={20} name="maple-leaf" />
        </Box>

        <Text variant="homeHeader" color={textColor}>
          {i18n.translate('Home.AppName')}
        </Text>
      </Box>
    </TouchableWithoutFeedback>
  );
};
