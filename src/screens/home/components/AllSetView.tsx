import React from 'react';
import {Box, Icon, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {BaseHomeView} from './BaseHomeView';

export const AllSetView = ({bodyText}: {bodyText: string}) => {
  const [i18n] = useI18n();
  return (
    <BaseHomeView iconName="thumbs-up">
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected.AllSetTitle')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {bodyText}
      </Text>

      <Box
        backgroundColor="green2"
        borderRadius={10}
        paddingVertical="m"
        paddingLeft="s"
        paddingRight="m"
        flexDirection="row"
        marginTop="m"
        marginBottom="xl"
      >
        <Box flex={0} paddingTop="xxs" marginRight="xxs">
          <Icon name="icon-light-bulb" size={40} />
        </Box>
        <Box flex={1}>
          <Text>
            <Text fontWeight="bold">{i18n.translate('Home.NoExposureDetected.AllSetTipTitle')}</Text>
            <Text>{i18n.translate('Home.NoExposureDetected.AllSetTipBody')}</Text>
          </Text>
        </Box>
      </Box>
    </BaseHomeView>
  );
};
