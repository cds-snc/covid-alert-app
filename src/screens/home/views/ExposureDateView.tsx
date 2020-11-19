import React, {useMemo} from 'react';
import {Text} from 'components';
import {useI18n} from 'locale';
import {useExposureNotificationService} from 'services/ExposureNotificationService';

export const ExposureDateView = () => {
  const i18n = useI18n();
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const dateFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };

  const exposureNotificationService = useExposureNotificationService();

  const formatDate = (locale: string, localeString: string) => {
    const parts = localeString.split(' ');
    // @note \u00a0 is a non breaking space so the date doesn't wrap
    if (locale === 'en-CA') {
      return `${parts[0]}.\u00a0${parts[1]}\u00a0${parts[2]}`;
    } else if (locale === 'fr-CA') {
      return `${parts[0]}\u00a0${parts[1]}\u00a0${parts[2]}`;
    }

    return localeString;
  };

  const date = useMemo(() => {
    const timeStamp = exposureNotificationService.getExposureDetectedAt();
    if (timeStamp) return formatDate(dateLocale, new Date(timeStamp).toLocaleString(dateLocale, dateFormatOptions));
  }, [dateFormatOptions, dateLocale]);

  return date ? (
    <Text marginBottom="m">
      {i18n.translate('Home.ExposureDetected.Notification.Received')}: <Text fontWeight="bold">{date}</Text>
    </Text>
  ) : null;
};
