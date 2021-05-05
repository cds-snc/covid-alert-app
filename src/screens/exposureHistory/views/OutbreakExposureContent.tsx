import React from 'react';
import {useI18n} from 'locale';
import {Text, TextMultiline} from 'components';
import {HomeScreenTitle} from 'screens/home/components/HomeScreenTitle';
import {OutbreakConditionalText} from 'screens/home/views/OutbreakExposedView';
import {useOutbreakService} from 'services/OutbreakService';
import {formatExposedDate} from 'shared/date-fns';

export const OutbreakExposureContent = ({timestamp}: {timestamp: number}) => {
  const i18n = useI18n();
  const {outbreakHistory} = useOutbreakService();
  const historyItem = outbreakHistory.filter(item => item.checkInTimestamp === timestamp)[0];
  const severity = historyItem?.severity;
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
  const exposureDate = formatExposedDate(new Date(historyItem?.checkInTimestamp), dateLocale);
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
