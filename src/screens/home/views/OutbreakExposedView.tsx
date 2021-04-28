import React from 'react';
import {RoundedBox, Text} from 'components';
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
  const severity = mostRecentHistoryItem.severity;

  return (
    <BaseHomeView iconName="hand-caution-yellow" testID="outbreakExposure">
      <RoundedBox isFirstBox>
        <HomeScreenTitle>{i18n.translate(`QRCode.OutbreakExposed.Title`)}</HomeScreenTitle>
        <Text marginBottom="m">{i18n.translate(`QRCode.OutbreakExposed.Body`)}</Text>
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
        {i18n.translate('QRCode.OutbreakExposed.NextSteps.Title')}
      </Text>
      <Text marginBottom="m">{i18n.translate('QRCode.OutbreakExposed.NextSteps.Body')}</Text>
      <NegativeOutbreakTestButton />
    </>
  );
};

const MonitorText = ({i18n}: {i18n: I18n}) => {
  return (
    <>
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        Self Monitor!
      </Text>
    </>
  );
};

const GetTestedText = ({i18n}: {i18n: I18n}) => {
  return (
    <>
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        Get Tested!
      </Text>
    </>
  );
};
