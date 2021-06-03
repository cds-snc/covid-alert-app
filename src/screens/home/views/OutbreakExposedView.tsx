import React from 'react';
import {RoundedBox, Text, TextMultiline} from 'components';
import {useI18n, I18n} from 'locale';
import {useOutbreakService} from 'services/OutbreakService';
import {getNonIgnoredOutbreakHistory, OutbreakHistoryItem, OutbreakSeverity} from 'shared/qr';
import {formatExposedDate} from 'shared/date-fns';
import {TEST_MODE} from 'env';

import {BaseHomeView} from '../components/BaseHomeView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

import {NegativeOutbreakTestButton} from './ClearOutbreakExposureView';

export const OutbreakExposedView = () => {
  const i18n = useI18n();
  const {outbreakHistory} = useOutbreakService();
  const nonIgnoredOutbreakHistory = getNonIgnoredOutbreakHistory(outbreakHistory);
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';

  const historyItem: OutbreakHistoryItem = nonIgnoredOutbreakHistory[0];

  const severity = historyItem?.severity;
  const exposureDate = TEST_MODE
    ? formatExposedDate(new Date(), dateLocale)
    : formatExposedDate(new Date(historyItem?.notificationTimestamp), dateLocale);

  return (
    <BaseHomeView iconName="hand-caution" testID="outbreakExposure">
      <RoundedBox isFirstBox>
        <HomeScreenTitle>{i18n.translate(`QRCode.OutbreakExposed.Title`)}</HomeScreenTitle>
        <Text testID="bodyText" marginBottom="m">
          {i18n.translate(`QRCode.OutbreakExposed.Body`)}
        </Text>
        <Text marginBottom="m">
          {i18n.translate(`QRCode.OutbreakExposed.DateDesc`)}
          <Text fontWeight="bold">{exposureDate}</Text>
        </Text>
      </RoundedBox>
      <RoundedBox isFirstBox={false}>
        <OutbreakConditionalText severity={severity} i18n={i18n} />
      </RoundedBox>
    </BaseHomeView>
  );
};

export const OutbreakConditionalText = ({
  severity,
  i18n,
  showNegativeTestButton = true,
}: {
  severity: OutbreakSeverity;
  i18n: I18n;
  showNegativeTestButton?: boolean;
}) => {
  switch (severity) {
    case OutbreakSeverity.SelfIsolate:
      return <IsolateText i18n={i18n} showNegativeTestButton={showNegativeTestButton} />;
    case OutbreakSeverity.SelfMonitor:
      return <MonitorText i18n={i18n} />;
    default:
      return <MonitorText i18n={i18n} />;
  }
};

const IsolateText = ({i18n, showNegativeTestButton}: {i18n: I18n; showNegativeTestButton: boolean}) => {
  return (
    <>
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate('QRCode.OutbreakExposed.SelfIsolate.Title')}
      </Text>
      <TextMultiline marginBottom="m" text={i18n.translate('QRCode.OutbreakExposed.SelfIsolate.Body')} />
      {showNegativeTestButton ? <NegativeOutbreakTestButton /> : null}
    </>
  );
};

const MonitorText = ({i18n}: {i18n: I18n}) => {
  return (
    <>
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate('QRCode.OutbreakExposed.SelfMonitor.Title')}
      </Text>
      <TextMultiline marginBottom="m" text={i18n.translate('QRCode.OutbreakExposed.SelfMonitor.Body')} />
    </>
  );
};
