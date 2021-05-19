import React from 'react';
import {useI18n} from 'locale';
import {Text, TextMultiline} from 'components';
import {HomeScreenTitle} from 'screens/home/components/HomeScreenTitle';
import {OutbreakConditionalText} from 'screens/home/views/OutbreakExposedView';
import {formatExposedDate} from 'shared/date-fns';
import {OutbreakHistoryItem} from 'shared/qr';

export const OutbreakExposureContent = ({historyItem}: {historyItem: OutbreakHistoryItem}) => {
  const i18n = useI18n();
  const severity = historyItem?.severity;
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const exposureDate = formatExposedDate(new Date(historyItem?.notificationTimestamp), dateLocale);
  return (
    <>
      <HomeScreenTitle>{i18n.translate(`QRCode.OutbreakExposed.Title`)}</HomeScreenTitle>
      <TextMultiline marginBottom="s" text={i18n.translate(`QRCode.OutbreakExposed.Body`)} />
      <Text marginBottom="l">
        {i18n.translate(`QRCode.OutbreakExposed.DateDesc`)}
        <Text fontWeight="bold">{exposureDate}</Text>
      </Text>
      <OutbreakConditionalText severity={severity} i18n={i18n} showNegativeTestButton={false} />
    </>
  );
};
