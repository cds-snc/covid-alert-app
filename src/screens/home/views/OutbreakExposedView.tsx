import React from 'react';
import {RoundedBox, Text, TextMultiline} from 'components';
import {useI18n, I18n} from 'locale';
import {useOutbreakService} from 'services/OutbreakService';
import {getCurrentOutbreakHistory, OutbreakSeverity} from 'shared/qr';

import {BaseHomeView} from '../components/BaseHomeView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

import {NegativeOutbreakTestButton} from './ClearOutbreakExposureView';

export const OutbreakExposedView = () => {
  const i18n = useI18n();
  const {outbreakHistory} = useOutbreakService();
  const currentOutbreakHistory = getCurrentOutbreakHistory(outbreakHistory);
  const mostRecentHistoryItem = currentOutbreakHistory[0];
  const severity = mostRecentHistoryItem?.severity;

  return (
    <BaseHomeView iconName="hand-caution-yellow" testID="outbreakExposure">
      <RoundedBox isFirstBox>
        <HomeScreenTitle>{i18n.translate(`QRCode.OutbreakExposed.Title`)}</HomeScreenTitle>
        <Text testID="bodyText" marginBottom="m">
          {i18n.translate(`QRCode.OutbreakExposed.Body`)}
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
