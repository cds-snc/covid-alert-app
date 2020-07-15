import React from 'react';
import {useI18n} from 'locale';
import {Text} from 'components';
import {useExposureStatus} from 'services/ExposureNotificationService';
import {daysBetween, getCurrentDate} from 'shared/date-fns';
import {pluralizeKey} from 'shared/pluralization';
import {useStorage} from 'services/StorageService';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

import {BaseHomeView} from '../components/BaseHomeView';
import {Tip} from '../components/Tip';

export const DiagnosedView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const i18n = useI18n();
  const {region} = useStorage();
  const [exposureStatus] = useExposureStatus();
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);

  if (exposureStatus.type !== 'diagnosed') return null;

  const daysLeft = daysBetween(getCurrentDate(), new Date(exposureStatus.cycleEndsAt)) - 1;

  return (
    <BaseHomeView iconName="hand-thank-you-with-love">
      <Text focusRef={autoFocusRef} variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
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
