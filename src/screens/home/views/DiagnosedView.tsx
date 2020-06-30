import React from 'react';
import {useI18n} from '@shopify/react-i18n';
import {Text} from 'components';
import {useExposureStatus} from 'services/ExposureNotificationService';
import {daysBetween} from 'shared/date-fns';
import {pluralizeKey} from 'shared/pluralization';

import {BaseHomeView} from '../components/BaseHomeView';

export const DiagnosedView = () => {
  const [i18n] = useI18n();
  const [exposureStatus] = useExposureStatus();

  if (exposureStatus.type !== 'diagnosed') return null;

  const daysDiff = daysBetween(new Date(), new Date(exposureStatus.cycleEndsAt));

  return (
    <BaseHomeView iconName="hand-wave">
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.DiagnosedView.Title')}
        {/* No exposure detected */}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate(pluralizeKey('Home.DiagnosedView.Body1', daysDiff), {number: daysDiff})}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.DiagnosedView.Body2')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.DiagnosedView.Body3')}
      </Text>
    </BaseHomeView>
  );
};
