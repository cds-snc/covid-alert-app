import React, {useMemo} from 'react';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {useExposureNotificationService} from 'services/ExposureNotificationService';
import {formatExposedDate, getCurrentDate, getFirstThreeUniqueDates} from 'shared/date-fns';
import {ForceScreen} from 'shared/ForceScreen';
import {useCachedStorage} from 'services/StorageService';
import {log} from 'shared/logging/config';

export const ExposureDateView = ({timestamp}: {timestamp?: number}) => {
  const i18n = useI18n();
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const {forceScreen, qrEnabled} = useCachedStorage();

  const exposureNotificationService = useExposureNotificationService();

  const dates: Date[] = useMemo(() => {
    if (forceScreen && forceScreen !== ForceScreen.None) {
      return [getCurrentDate()];
    }
    if (timestamp) {
      return [new Date(timestamp)];
    }
    const _dates = exposureNotificationService.getExposureDetectedAt();
    log.debug({message: '_dates', payload: {_dates}});
    return _dates;
  }, [exposureNotificationService, forceScreen, timestamp]);

  const formattedDates = dates.map(date => {
    return formatExposedDate(date, dateLocale);
  });
  console.log('formattedDates', formattedDates);
  const firstThreeUniqueDates = getFirstThreeUniqueDates(formattedDates);
  log.debug({message: 'firstThreeUniqueDates', payload: {firstThreeUniqueDates}});
  return firstThreeUniqueDates ? (
    <Box marginBottom="m">
      {qrEnabled ? (
        <Text>
          {i18n.translate('Home.ExposureDetected.Notification.Received')}:{' '}
          <Text fontWeight="bold">{firstThreeUniqueDates[0]}</Text>
        </Text>
      ) : (
        <>
          <Text>{i18n.translate('Home.ExposureDetected.Notification.Received')}: </Text>

          {firstThreeUniqueDates.map((date, index) => (
            <Text fontWeight={index === 0 ? 'bold' : 'normal'} key={date}>
              {date}
            </Text>
          ))}
        </>
      )}
    </Box>
  ) : null;
};
