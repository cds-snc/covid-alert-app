import React, {useMemo} from 'react';
import {Text} from 'components';
import {useI18n} from 'locale';
import {useExposureNotificationService} from 'services/ExposureNotificationService';

export const ExposureDateView = () => {
  const i18n = useI18n();
  const exposureNotificationService = useExposureNotificationService();

  const date = useMemo(() => {
    return exposureNotificationService.getLastExposedDate();
  }, [exposureNotificationService]);

  return (
    <Text marginBottom="m">
      {i18n.translate('Home.ExposureDetected.Notification.Received')}:{date}
    </Text>
  );
};
