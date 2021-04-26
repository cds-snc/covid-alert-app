import React from 'react';
import {useI18n} from 'locale';
import {getUploadDaysLeft} from 'shared/date-fns';
import {pluralizeKey} from 'shared/pluralization';
import {InfoBlock} from 'components';
import {ExposureStatusType, useExposureStatus} from 'services/ExposureNotificationService';

export const DiagnosedThankYou = () => {
  const exposureStatus = useExposureStatus();
  const i18n = useI18n();
  if (exposureStatus.type !== ExposureStatusType.Diagnosed) {
    return null;
  }
  const daysLeft = getUploadDaysLeft(exposureStatus.cycleEndsAt);
  let bodyText = i18n.translate('OverlayOpen.EnterCodeCardBodyDiagnosed');
  if (daysLeft > 0) {
    bodyText += i18n.translate(pluralizeKey('OverlayOpen.EnterCodeCardDiagnosedCountdown', daysLeft), {
      number: daysLeft,
    });
  }
  return (
    <InfoBlock
      titleBolded={i18n.translate('OverlayOpen.EnterCodeCardTitleDiagnosed')}
      text={bodyText}
      button={{
        text: '',
        action: () => {},
      }}
      backgroundColor="infoBlockNeutralBackground"
      color="bodyText"
      showButton={false}
    />
  );
};
