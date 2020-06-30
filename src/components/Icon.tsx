import React from 'react';
import IconCheck from 'assets/check.svg';
import IconGreenCheck from 'assets/green-check.svg';
import Ellipsis from 'assets/ellipsis.svg';
import HeaderLogoRings from 'assets/header-logo-rings.svg';
import IconBackArrow from 'assets/icon-back-arrow.svg';
import IconBluetoothDisabled from 'assets/icon-bluetooth-disabled.svg';
import IconBluetoothOff from 'assets/icon-bluetooth-off.svg';
import IconBluetooth from 'assets/icon-bluetooth.svg';
import IconChevron from 'assets/icon-chevron.svg';
import IconChevronBack from 'assets/icon-chevron-back.svg';
import IconChevronWhite from 'assets/icon-chevron-white.svg';
import IconClose from 'assets/icon-close.svg';
import IconEnterCode from 'assets/icon-enter-code.svg';
import IconExternalArrow from 'assets/icon-external-arrow.svg';
import IconExternalArrowLight from 'assets/icon-external-arrow-light.svg';
import IconImportant from 'assets/icon-important.svg';
import IconMessages from 'assets/icon-messages.svg';
import IconNotify from 'assets/icon-notify.svg';
import IconShare from 'assets/icon-share.svg';
import IconNotifications from 'assets/icon-notifications.svg';
import IconNoNotifications from 'assets/icon-no-notifications.svg';
import IconLearn from 'assets/icon-learn.svg';
import IconLightBulb from 'assets/icon-light-bulb.svg';
import IconOffline from 'assets/icon-offline-2.svg';
import IconWarning from 'assets/icon-warning.svg';
import IconExposureNotificationsDisabled from 'assets/icon-exposure-notifications-disabled.svg';
import IconExposureNotificationsOff from 'assets/icon-exposure-notifications-off.svg';
import CovidAlertEn from 'assets/covid-alert-en.svg';
import CovidAlertFr from 'assets/covid-alert-fr.svg';
import ProgressCircleEmpty from 'assets/progress-circle-empty.svg';
import ProgressCircleFilled from 'assets/progress-circle-filled.svg';
import ShareHeading from 'assets/share-heading.svg';
import SheetHandleBar from 'assets/sheet-handle-bar.svg';
import SheetHandleBarClose from 'assets/sheet-handle-bar-close.svg';
import ShieldActive from 'assets/shield-active.svg';
import ShieldCovid from 'assets/shield-covid.svg';
import MapleLeaf from 'assets/maple-leaf.svg';
import ShieldDisabled from 'assets/shield-disabled.svg';
import IconX from 'assets/icon-x.svg';
import ThumbsUp from 'assets/thumbs-up.svg';
import HandCaution from 'assets/hand-caution.svg';
import HandWave from 'assets/hand-wave.svg';
import StopCOVID from 'assets/StopCOVID.svg';

const ICONS = {
  'icon-x': IconX,
  'icon-back-arrow': IconBackArrow,
  'icon-bluetooth': IconBluetooth,
  'icon-bluetooth-disabled': IconBluetoothDisabled,
  'icon-bluetooth-off': IconBluetoothOff,
  'icon-check': IconCheck,
  'icon-green-check': IconGreenCheck,
  'icon-chevron': IconChevron,
  'icon-chevron-back': IconChevronBack,
  'icon-chevron-white': IconChevronWhite,
  'icon-close': IconClose,
  'icon-enter-code': IconEnterCode,
  'icon-ellipsis': Ellipsis,
  'icon-external-arrow': IconExternalArrow,
  'icon-external-arrow-light': IconExternalArrowLight,
  'icon-important': IconImportant,
  'icon-messages': IconMessages,
  'icon-notify': IconNotify,
  'icon-share': IconShare,
  'icon-notifications': IconNotifications,
  'icon-no-notifications': IconNoNotifications,
  'icon-learn': IconLearn,
  'icon-light-bulb': IconLightBulb,
  'icon-offline': IconOffline,
  'icon-exposure-notifications-off': IconExposureNotificationsOff,
  'icon-exposure-notifications-disabled': IconExposureNotificationsDisabled,
  'icon-warning': IconWarning,
  'covid-alert-en': CovidAlertEn,
  'covid-alert-fr': CovidAlertFr,
  'header-logo-rings': HeaderLogoRings,
  'progress-circle-filled': ProgressCircleFilled,
  'progress-circle-empty': ProgressCircleEmpty,
  'share-heading': ShareHeading,
  'sheet-handle-bar': SheetHandleBar,
  'sheet-handle-bar-close': SheetHandleBarClose,
  'shield-disabled': ShieldDisabled,
  'shield-active': ShieldActive,
  'shield-covid': ShieldCovid,
  'maple-leaf': MapleLeaf,
  'stop-covid': StopCOVID,
  'thumbs-up': ThumbsUp,
  'hand-caution': HandCaution,
  'hand-wave': HandWave,
};

export type IconName = keyof typeof ICONS;

export interface IconProps {
  name: IconName | undefined;
  size?: number;
}

export const Icon = ({name, size = 24}: IconProps) => {
  const IconImpl = name !== undefined ? ICONS[name] : null; // eslint-disable-line no-negated-condition
  return IconImpl ? <IconImpl width={size} height={size} /> : null;
};
