import React, {useMemo} from 'react';
import {Text} from 'components';
import {useI18n} from 'locale';
import {useExposureNotificationService} from 'services/ExposureNotificationService';
import {formatExposedDate} from 'shared/date-fns';
import {ForceScreen} from 'shared/ForceScreen';
import {useStorage} from 'services/StorageService';

export const ExposureDateView = () => {
  const i18n = useI18n();
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const {forceScreen} = useStorage();
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
    else if (forceScreen && forceScreen !== ForceScreen.None)
      return formatExposedDate(dateLocale, new Date().toLocaleString(dateLocale, dateFormatOptions));
  }, [dateFormatOptions, dateLocale, exposureNotificationService, forceScreen]);

  return date ? (
    <Text marginBottom="m">
      {i18n.translate('Home.ExposureDetected.Notification.Received')}: <Text fontWeight="bold">{date}</Text>
    </Text>
  ) : null;
};
