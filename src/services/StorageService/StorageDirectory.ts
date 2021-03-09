import {KeyDefinition, StorageType} from './FutureStorageService';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class StorageDirectory {
  // Global
  static readonly GlobalOnboardedDatetimeKey: KeyDefinition = {
    keyIdentifier: 'OnboardedDatetime',
    storageType: StorageType.Unsecure,
  };

  static readonly GlobalRegionKey: KeyDefinition = {
    keyIdentifier: 'Region',
    storageType: StorageType.Unsecure,
  };

  static readonly GlobalLocaleKey: KeyDefinition = {
    keyIdentifier: 'Locale',
    storageType: StorageType.Unsecure,
  };

  static readonly GlobalQrEnabledKey: KeyDefinition = {
    keyIdentifier: 'QrEnabled',
    storageType: StorageType.Unsecure,
  };

  // StorageService.ts
  static readonly StorageServiceIsOnboardedKey: KeyDefinition = {
    keyIdentifier: 'IsOnboarded',
    storageType: StorageType.Unsecure,
  };

  static readonly StorageServiceForceScreenKey: KeyDefinition = {
    keyIdentifier: 'ForceScreen',
    storageType: StorageType.Unsecure,
  };

  static readonly StorageServiceSkipAllSetKey: KeyDefinition = {
    keyIdentifier: 'SkipAllSet',
    storageType: StorageType.Unsecure,
  };

  static readonly StorageServiceUserStoppedKey: KeyDefinition = {
    keyIdentifier: 'UserStopped',
    storageType: StorageType.Unsecure,
  };

  static readonly StorageServiceHasViewedQRInstructionsKey: KeyDefinition = {
    keyIdentifier: 'HasViewedQRInstructions',
    storageType: StorageType.Unsecure,
  };

  // ExposureNotificationService.ts
  static readonly ExposureNotificationServiceExposureHistoryKey: KeyDefinition = {
    keyIdentifier: 'exposureHistory',
    storageType: StorageType.Secure,
  };

  static readonly ExposureNotificationServiceSubmissionAuthKeysKey: KeyDefinition = {
    keyIdentifier: 'submissionAuthKeys',
    storageType: StorageType.Secure,
  };

  static readonly ExposureNotificationServiceExposureStatusKey: KeyDefinition = {
    keyIdentifier: 'exposureStatus',
    storageType: StorageType.Unsecure,
  };

  static readonly ExposureNotificationServiceExposureConfigurationKey: KeyDefinition = {
    keyIdentifier: 'exposureConfiguration',
    storageType: StorageType.Unsecure,
  };

  // OutbreakProvider.tsx
  static readonly OutbreakProviderOutbreaksLastCheckedStorageKey: KeyDefinition = {
    keyIdentifier: 'A436ED42-707E-11EB-9439-0242AC130002',
    storageType: StorageType.Secure,
  };

  // PollNotificationService.ts
  static readonly PollNotificationServiceReadReceiptsKey: KeyDefinition = {
    keyIdentifier: 'NotificationReadReceipts',
    storageType: StorageType.Unsecure,
  };

  static readonly PollNotificationServiceEtagStorageKey: KeyDefinition = {
    keyIdentifier: 'NotificationsEtag',
    storageType: StorageType.Unsecure,
  };

  static readonly PollNotificationServiceLastPollNotificationDateTimeKey: KeyDefinition = {
    keyIdentifier: 'LastPollNotificationDateTimeKey',
    storageType: StorageType.Secure,
  };

  // MetricsStorage.ts
  static readonly MetricsStorageKey: KeyDefinition = {
    keyIdentifier: 'AE6AE306-523B-4D92-871E-9D13D5CA9B23',
    storageType: StorageType.Secure,
  };

  // MetricsService.ts
  static readonly MetricsServiceLastMetricTimestampSentToTheServerKey: KeyDefinition = {
    keyIdentifier: '3FFE2346-1910-4FD7-A23F-52D83CFF083A',
    storageType: StorageType.Secure,
  };

  static readonly MetricsServiceMetricsLastUploadedDateTimeKey: KeyDefinition = {
    keyIdentifier: 'C0663511-3718-4D85-B165-A38155DED2F3',
    storageType: StorageType.Secure,
  };

  // MetricsFilterStateStorage.ts
  static readonly MetricsFilterStateStorageInstalledEventMarkerKey: KeyDefinition = {
    keyIdentifier: 'A607DDBD-D592-4927-8861-DD1CCEDA8E76',
    storageType: StorageType.Secure,
  };

  static readonly MetricsFilterStateStorageOnboardedEventMarkerKey: KeyDefinition = {
    keyIdentifier: '0429518A-9D4D-4EB2-A5A8-AEA985DEB1D7',
    storageType: StorageType.Secure,
  };

  static readonly MetricsFilterStateStorageBackgroundCheckEventMarkerKey: KeyDefinition = {
    keyIdentifier: 'AB398409-D8A9-4BC2-91F0-63E4CEFCD89A',
    storageType: StorageType.Secure,
  };

  static readonly MetricsFilterStateStorageActiveUserEventMarkerKey: KeyDefinition = {
    keyIdentifier: 'B678D2BD-1596-4650-B28C-4606E34DC4CA',
    storageType: StorageType.Secure,
  };

  // BackendService.ts
  static readonly BackendServiceRegionContentKey: KeyDefinition = {
    keyIdentifier: '30F6F699-43F7-44A1-B138-89278C25A1AB',
    storageType: StorageType.Unsecure,
  };

  static readonly BackendServiceLastUploadedTekStartTimeKey: KeyDefinition = {
    keyIdentifier: 'LAST_UPLOADED_TEK_START_TIME',
    storageType: StorageType.Unsecure,
  };
}
