import React, {useMemo} from 'react';
import {Text} from 'components';
import {useI18n} from 'locale';
import {useExposureNotificationService} from 'services/ExposureNotificationService';
import {formatExposedDate} from 'shared/date-fns';

export const ExposureDateView = () => {
  const i18n = useI18n();
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const dateFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  const exposureNotificationService = useExposureNotificationService();

  const date = useMemo(() => {
    const timeStamp = exposureNotificationService.getExposureDetectedAt();
    if (timeStamp)
      return formatExposedDate(dateLocale, new Date(timeStamp).toLocaleString(dateLocale, dateFormatOptions));
  }, [dateFormatOptions, dateLocale]);

  return date ? (
    <Text marginBottom="m">
      {i18n.translate('Home.ExposureDetected.Notification.Received')}: <Text fontWeight="bold">{date}</Text>
    </Text>
  ) : null;
};
