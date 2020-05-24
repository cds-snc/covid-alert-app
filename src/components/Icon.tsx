import React from 'react';
import IconCheck from 'assets/check.svg';
import Ellipsis from 'assets/ellipsis.svg';
import HeaderLogoRings from 'assets/header-logo-rings.svg';
import IconBackArrow from 'assets/icon-back-arrow.svg';
import IconBluetoothDisabled from 'assets/icon-bluetooth-disabled.svg';
import IconBluetoothOff from 'assets/icon-bluetooth-off.svg';
import IconBluetooth from 'assets/icon-bluetooth.svg';
import IconChevron from 'assets/icon-chevron.svg';
import IconClose from 'assets/icon-close.svg';
import IconEnterCode from 'assets/icon-enter-code.svg';
import IconExternalArrow from 'assets/icon-external-arrow.svg';
import IconImportant from 'assets/icon-important.svg';
import IconMessages from 'assets/icon-messages.svg';
import IconNotify from 'assets/icon-notify.svg';
import IconShare from 'assets/icon-share.svg';
import IconNotifications from 'assets/icon-notifications.svg';
import IconLearn from 'assets/icon-learn.svg';
import IconOffline from 'assets/icon-offline.svg';
import IconExposureNotificationsDisabled from 'assets/icon-exposure-notifications-disabled.svg';
import IconExposureNotificationsOff from 'assets/icon-exposure-notifications-off.svg';
import ProgressCircleEmpty from 'assets/progress-circle-empty.svg';
import ProgressCircleFilled from 'assets/progress-circle-filled.svg';
import ShareHeading from 'assets/share-heading.svg';
import SheetHandleBar from 'assets/sheet-handle-bar.svg';
import ShieldActive from 'assets/shield-active.svg';
import ShieldCovid from 'assets/shield-covid.svg';
import ShieldDisabled from 'assets/shield-disabled.svg';

const ICONS = {
  'icon-back-arrow': IconBackArrow,
  'icon-bluetooth': IconBluetooth,
  'icon-bluetooth-disabled': IconBluetoothDisabled,
  'icon-bluetooth-off': IconBluetoothOff,
  'icon-check': IconCheck,
  'icon-chevron': IconChevron,
  'icon-close': IconClose,
  'icon-enter-code': IconEnterCode,
  'icon-ellipsis': Ellipsis,
  'icon-external-arrow': IconExternalArrow,
  'icon-important': IconImportant,
  'icon-messages': IconMessages,
  'icon-notify': IconNotify,
  'icon-share': IconShare,
  'icon-notifications': IconNotifications,
  'icon-learn': IconLearn,
  'icon-offline': IconOffline,
  'icon-exposure-notifications-off': IconExposureNotificationsOff,
  'icon-exposure-notifications-disabled': IconExposureNotificationsDisabled,
  'header-logo-rings': HeaderLogoRings,
  'progress-circle-filled': ProgressCircleFilled,
  'progress-circle-empty': ProgressCircleEmpty,
  'share-heading': ShareHeading,
  'sheet-handle-bar': SheetHandleBar,
  'shield-disabled': ShieldDisabled,
  'shield-active': ShieldActive,
  'shield-covid': ShieldCovid,
};

type IconName = keyof typeof ICONS;

export interface IconProps {
  name: IconName;
  size?: number;
  accessibilityLabel?: string;
}

export const Icon = ({name, size = 24, accessibilityLabel}: IconProps) => {
  const IconImpl = ICONS[name];
  return IconImpl ? <IconImpl accessible accessibilityLabel={accessibilityLabel} width={size} height={size} /> : null;
};
