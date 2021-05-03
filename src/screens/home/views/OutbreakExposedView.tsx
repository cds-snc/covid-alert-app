import React from 'react';
import {RoundedBox, Text, TextMultiline} from 'components';
import {useI18n, I18n} from 'locale';
import {useOutbreakService} from 'services/OutbreakService';
import {getCurrentOutbreakHistory, OutbreakHistoryItem, OutbreakSeverity} from 'shared/qr';
import {formatExposedDate} from 'shared/date-fns';

import {BaseHomeView} from '../components/BaseHomeView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

import {NegativeOutbreakTestButton} from './ClearOutbreakExposureView';

export const OutbreakExposedView = ({id}: {id?: string}) => {
  const i18n = useI18n();
  const {outbreakHistory} = useOutbreakService();
  const currentOutbreakHistory = getCurrentOutbreakHistory(outbreakHistory);
  const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';

  let historyItem: OutbreakHistoryItem = currentOutbreakHistory[0];

  if (id) {
    currentOutbreakHistory.forEach(item => {
      if (item.outbreakId === id) {
        historyItem = item;
      }
    });
  }

  const severity = historyItem?.severity;
  const exposureDate = formatExposedDate(new Date(historyItem?.checkInTimestamp), dateLocale);
  let props = {};

  if (id) {
    props = {header: false};
  }

  return (
    <BaseHomeView iconName="hand-caution-yellow" testID="outbreakExposure" {...props}>
      <RoundedBox isFirstBox>
        <HomeScreenTitle>{i18n.translate(`QRCode.OutbreakExposed.Title`)}</HomeScreenTitle>
        <Text marginBottom="m">{i18n.translate(`QRCode.OutbreakExposed.Body`)}</Text>
        <Text marginBottom="m">
          {i18n.translate(`QRCode.OutbreakExposed.DateDesc`)}
          <Text fontWeight="bold">{exposureDate}</Text>
        </Text>
      </RoundedBox>
      <RoundedBox isFirstBox={false}>
        <ConditionalText severity={severity} i18n={i18n} />
      </RoundedBox>
    </BaseHomeView>
  );
};

const ConditionalText = ({severity, i18n}: {severity: OutbreakSeverity; i18n: I18n}) => {
  switch (severity) {
    case OutbreakSeverity.GetTested:
      return <GetTestedText i18n={i18n} />;
    case OutbreakSeverity.SelfIsolate:
      return <IsolateText i18n={i18n} />;
    case OutbreakSeverity.SelfMonitor:
      return <MonitorText i18n={i18n} />;
  }
};

const IsolateText = ({i18n}: {i18n: I18n}) => {
  return (
    <>
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate('QRCode.OutbreakExposed.SelfIsolate.Title')}
      </Text>
      <TextMultiline marginBottom="m" text={i18n.translate('QRCode.OutbreakExposed.SelfIsolate.Body')} />
      <NegativeOutbreakTestButton />
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

const GetTestedText = ({i18n}: {i18n: I18n}) => {
  return (
    <>
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate('QRCode.OutbreakExposed.GetTested.Title')}
      </Text>
      <TextMultiline marginBottom="m" text={i18n.translate('QRCode.OutbreakExposed.GetTested.Body')} />
      <NegativeOutbreakTestButton />
    </>
  );
};
