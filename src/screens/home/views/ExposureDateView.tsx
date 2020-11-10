import React, {useMemo} from 'react';
import {Text} from 'components';
import {useI18n} from 'locale';
import {useExposureNotificationService} from 'services/ExposureNotificationService';

export const ExposureDateView = () => {
  const i18n = useI18n();
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';

  const dateFormat =
    i18n.locale === 'fr'
      ? {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }
      : {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        };

  const exposureNotificationService = useExposureNotificationService();

  const date = useMemo(() => {
    const timeStamp = exposureNotificationService.getLastExposedDate();
    return new Date(timeStamp).toLocaleString(dateLocale, dateFormat);
  }, [exposureNotificationService]);

  return (
    <Text marginBottom="m">
      {i18n.translate('Home.ExposureDetected.Notification.Received')}: <Text fontWeight="bold">{date}</Text>
    </Text>
  );
};
