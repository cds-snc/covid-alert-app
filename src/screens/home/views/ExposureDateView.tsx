import React, {useMemo} from 'react';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {useExposureNotificationService} from 'services/ExposureNotificationService';
import {formatExposedDate} from 'shared/date-fns';
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

  const dates = useMemo(() => {
    if(forceScreen) {
      return [formatExposedDate(dateLocale, new Date().toLocaleString(dateLocale, dateFormatOptions))];
    }
    const timeStamps = exposureNotificationService.getExposureDetectedAt();
    return timeStamps.map(ts => {
      return formatExposedDate(dateLocale, new Date(ts).toLocaleString(dateLocale, dateFormatOptions));
    });
  }, [dateFormatOptions, dateLocale, exposureNotificationService, forceScreen])

  return dates ? (
    <Box marginBottom="m">
      <Text>
        {i18n.translate('Home.ExposureDetected.Notification.Received')}:
      </Text>
      <>
        {dates.map((date, n) =>
          <Text fontWeight={n === 0 ? "bold" : "normal"} key={n}>
            {date}
          </Text>
        )}
      </>
    </Box>
  ) : null;
};
