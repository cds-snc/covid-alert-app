import {useI18n} from 'locale';
import {Text, TextMultiline} from 'components';
import React from 'react';

import {SystemStatusWrapper} from '../components/BaseHomeView';

export const FrameworkUnavailableView = () => {
  const i18n = useI18n();

  return (
    <SystemStatusWrapper iconName="icon-bluetooth-disabled" testID="frameworkUnavailable">
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.FrameworkUnavailable.Title')}
      </Text>
      <TextMultiline marginBottom="m" text={i18n.translate('Home.FrameworkUnavailable.Body')} />
    </SystemStatusWrapper>
  );
};
