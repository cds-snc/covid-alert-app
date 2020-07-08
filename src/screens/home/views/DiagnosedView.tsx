import React from 'react';
import {useI18n} from '@shopify/react-i18n';
import {Text} from 'components';
import {useExposureStatus} from 'services/ExposureNotificationService';
import {daysBetween} from 'shared/date-fns';
import {pluralizeKey} from 'shared/pluralization';
import {useStorage} from 'services/StorageService';

import {BaseHomeView} from '../components/BaseHomeView';
import {Tip} from '../components/Tip';

export const DiagnosedView = () => {
  const [i18n] = useI18n();
  const {region} = useStorage();
  const [exposureStatus] = useExposureStatus();

  if (exposureStatus.type !== 'diagnosed') return null;

  const daysLeft = daysBetween(new Date(), new Date(exposureStatus.cycleEndsAt)) - 1;

  return (
    <BaseHomeView iconName="hand-wave">
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.DiagnosedView.Title')}
        {/* No exposure detected */}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate(pluralizeKey('Home.DiagnosedView.Body1', daysLeft), {number: daysLeft})}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.DiagnosedView.Body2')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.DiagnosedView.Body3')}
      </Text>
      {region === 'ON' ? <Tip /> : null}
    </BaseHomeView>
  );
};
