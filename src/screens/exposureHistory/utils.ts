import {CombinedExposureHistoryData, ExposureType, OutbreakHistoryItem, OutbreakSeverity} from 'shared/qr';
import {ProximityExposureHistoryItem} from 'services/ExposureNotificationService';
import {I18n} from 'locale';

const severityText = ({severity, i18n}: {severity: OutbreakSeverity; i18n: I18n}) => {
  switch (severity) {
    case OutbreakSeverity.SelfIsolate:
      return i18n.translate('QRCode.OutbreakExposed.SelfIsolate.Title');
    case OutbreakSeverity.SelfMonitor:
      return i18n.translate('QRCode.OutbreakExposed.SelfMonitor.Title');
  }
};

export const toOutbreakExposureHistoryData = ({
  history,
  i18n,
}: {
  history: OutbreakHistoryItem[];
  i18n: I18n;
}): CombinedExposureHistoryData[] => {
  return history.map(outbreak => {
    return {
      exposureType: ExposureType.Outbreak,
      subtitle: severityText({severity: Number(outbreak.severity), i18n}),
      notificationTimestamp: outbreak.notificationTimestamp,
      historyItem: outbreak,
    };
  });
};

export const toProximityExposureHistoryData = ({
  proximityExposureHistory,
  i18n,
}: {
  proximityExposureHistory: ProximityExposureHistoryItem[];
  i18n: I18n;
}): CombinedExposureHistoryData[] => {
  return proximityExposureHistory.map(item => {
    return {
      exposureType: ExposureType.Proximity,
      subtitle: i18n.translate('QRCode.ProximityExposure'),
      notificationTimestamp: item.notificationTimestamp,
      historyItem: item,
    };
  });
};
