import React, {useCallback} from 'react';
import {Text, Box, Button} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';

import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureNoRegionView = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const onRegion = useCallback(() => navigation.navigate('RegionSelect'), [navigation]);

  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView>
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected.NoRegion.Title')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.NoExposureDetected.NoRegion.Body')}
      </Text>

      <Box alignSelf="stretch" marginBottom="l">
        <Button
          text={i18n.translate('Home.ChooseRegionCTA')}
          variant="bigFlatDarkGrey"
          internalLink
          onPress={onRegion}
        />
      </Box>
    </BaseHomeView>
  );
};
