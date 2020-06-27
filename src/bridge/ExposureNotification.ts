/**
 * References
 * - Android: https://blog.google/documents/68/Android_Exposure_Notification_API_documentation_v1.2.pdf
 * - iOS: https://covid19-static.cdn-apple.com/applications/covid19/current/static/contact-tracing/pdf/ExposureNotification-FrameworkDocumentationv1.2.pdf
 */

import {NativeModules} from 'react-native';

import ExposureNotificationAdapter from './ExposureNotificationAdapter';

export {
  RiskLevel,
  Status,
  TemporaryExposureKey,
  ExposureSummary,
  ExposureConfiguration,
  ExposureInformation,
  ExposureNotification,
} from './ExposureNotificationAPI';
export default ExposureNotificationAdapter(NativeModules.ExposureNotification);
