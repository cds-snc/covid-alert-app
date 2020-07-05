import React from 'react';
import {Text} from 'components';
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
    </BaseHomeView>
  );
};
