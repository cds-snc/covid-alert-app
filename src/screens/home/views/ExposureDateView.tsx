import React, {useMemo} from 'react';
import {Text} from 'components';
import {useI18n} from 'locale';
import {useExposureNotificationService} from 'services/ExposureNotificationService';

export const ExposureDateView = () => {
  const i18n = useI18n();
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const dateFormat = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  const exposureNotificationService = useExposureNotificationService();

  const date = useMemo(() => {
    const timeStamp = exposureNotificationService.getLastExposedTimestamp();
    return new Date(timeStamp).toLocaleString(dateLocale, dateFormat);
  }, [dateFormat, dateLocale, exposureNotificationService]);

  return (
    <Text marginBottom="m">
      {i18n.translate('Home.ExposureDetected.Notification.Received')}: <Text fontWeight="bold">{date}</Text>
    </Text>
  );
};
