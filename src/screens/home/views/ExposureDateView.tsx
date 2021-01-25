import React, {useMemo} from 'react';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {useExposureNotificationService} from 'services/ExposureNotificationService';
import {formatExposedDate, getCurrentDate, getFirstThreeUniqueDates} from 'shared/date-fns';
import {ForceScreen} from 'shared/ForceScreen';
import {useStorage} from 'services/StorageService';

export const ExposureDateView = () => {
  const i18n = useI18n();
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const {forceScreen} = useStorage();

  const exposureNotificationService = useExposureNotificationService();

  const dates: Date[] = useMemo(() => {
    if (forceScreen && forceScreen !== ForceScreen.None) {
      return [getCurrentDate()];
    }
    return exposureNotificationService.getExposureDetectedAt();
  }, [exposureNotificationService, forceScreen]);

  const formattedDates = dates.map(date => {
    return formatExposedDate(date, dateLocale);
  });

  const firstThreeUniqueDates = getFirstThreeUniqueDates(formattedDates);
  return firstThreeUniqueDates ? (
    <Box marginBottom="m">
      <Text>{i18n.translate('Home.ExposureDetected.Notification.Received')}:</Text>
      <>
        {firstThreeUniqueDates.map((date, index) => (
          <Text fontWeight={index === 0 ? 'bold' : 'normal'} key={date}>
            {date}
          </Text>
        ))}
      </>
    </Box>
  ) : null;
};
