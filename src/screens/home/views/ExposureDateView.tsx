import React, {useMemo} from 'react';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {useExposureNotificationService} from 'services/ExposureNotificationService';
import {formatExposedDate, getCurrentDate, getFirstThreeUniqueDates} from 'shared/date-fns';
import {ForceScreen} from 'shared/ForceScreen';
import {useCachedStorage} from 'services/StorageService';
import {log} from 'shared/logging/config';

export const ExposureDateView = () => {
  const i18n = useI18n();
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const {forceScreen} = useCachedStorage();

  const exposureNotificationService = useExposureNotificationService();

  const dates: Date[] = useMemo(() => {
    if (forceScreen && forceScreen !== ForceScreen.None) {
      return [getCurrentDate()];
    }
    const _dates = exposureNotificationService.getExposureDetectedAt();
    log.debug({message: '_dates', payload: {_dates}});
    return _dates;
  }, [exposureNotificationService, forceScreen]);

  const formattedDates = dates.map(date => {
    return formatExposedDate(date, dateLocale);
  });

  const firstThreeUniqueDates = getFirstThreeUniqueDates(formattedDates);
  log.debug({message: 'firstThreeUniqueDates', payload: {firstThreeUniqueDates}});
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
