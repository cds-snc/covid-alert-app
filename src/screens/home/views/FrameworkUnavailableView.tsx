import {useI18n} from 'locale';
import {TextMultiline} from 'components';
import React from 'react';

import {BaseHomeView} from '../components/BaseHomeView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

export const FrameworkUnavailableView = () => {
  const i18n = useI18n();

  return (
    <BaseHomeView iconName="icon-bluetooth-disabled" testID="frameworkUnavailable">
      <HomeScreenTitle>{i18n.translate('Home.FrameworkUnavailable.Title')}</HomeScreenTitle>
      <TextMultiline marginBottom="m" text={i18n.translate('Home.FrameworkUnavailable.Body')} />
    </BaseHomeView>
  );
};
