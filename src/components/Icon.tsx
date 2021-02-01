import React from 'react';
import IconCheck from 'assets/check.svg';
import IconCheckWhite from 'assets/check-white.svg';
import IconGreenCheck from 'assets/green-check.svg';
import IconBackArrow from 'assets/icon-back-arrow.svg';
import IconDownArrow from 'assets/icon-down-arrow.svg';
import IconBluetoothDisabled from 'assets/icon-bluetooth-disabled.svg';
import IconChevron from 'assets/icon-chevron.svg';
import IconChevronBack from 'assets/icon-chevron-back.svg';
import IconChevronBackWhite from 'assets/icon-chevron-back-white.svg';
import IconChevronWhite from 'assets/icon-chevron-white.svg';
import IconExternalArrow from 'assets/icon-external-arrow.svg';
import IconExternalArrowLight from 'assets/icon-external-arrow-light.svg';
import IconLightBulb from 'assets/icon-light-bulb.svg';
import CovidAlertEn from 'assets/covid-alert-en.svg';
import CovidAlertFr from 'assets/covid-alert-fr.svg';
import ProgressCircleEmpty from 'assets/progress-circle-empty.svg';
import ProgressCircleFilled from 'assets/progress-circle-filled.svg';
import SheetHandleBar from 'assets/sheet-handle-bar.svg';
import SheetHandleBarClose from 'assets/sheet-handle-bar-close.svg';
import IconX from 'assets/icon-x.svg';
import ThumbsUp from 'assets/thumbs-up.svg';
import HandCaution from 'assets/hand-caution.svg';
import HandReminder from 'assets/hand-reminder.svg';
import HandThankYouWithLove from 'assets/hand-thank-you-with-love.svg';
import HandNoProvinceYet from 'assets/hand-no-province-yet.svg';
import CanadaLogo from 'assets/canada.svg';
import PurpleBullet from 'assets/purple-bullet.svg';
import HandReminderRed from 'assets/hand-reminder-red.svg';
import QRCode from 'assets/qr-code.svg';

const ICONS = {
  'icon-x': IconX,
  'icon-back-arrow': IconBackArrow,
  'icon-down-arrow': IconDownArrow,
  'icon-bluetooth-disabled': IconBluetoothDisabled,
  'icon-check': IconCheck,
  'icon-check-white': IconCheckWhite,
  'icon-green-check': IconGreenCheck,
  'icon-chevron': IconChevron,
  'icon-chevron-back': IconChevronBack,
  'icon-chevron-back-white': IconChevronBackWhite,
  'icon-chevron-white': IconChevronWhite,
  'icon-external-arrow': IconExternalArrow,
  'icon-external-arrow-light': IconExternalArrowLight,
  'icon-light-bulb': IconLightBulb,
  'covid-alert-en': CovidAlertEn,
  'covid-alert-fr': CovidAlertFr,
  'progress-circle-filled': ProgressCircleFilled,
  'progress-circle-empty': ProgressCircleEmpty,
  'purple-bullet': PurpleBullet,
  'sheet-handle-bar': SheetHandleBar,
  'sheet-handle-bar-close': SheetHandleBarClose,
  'thumbs-up': ThumbsUp,
  'hand-caution': HandCaution,
  'hand-reminder': HandReminder,
  'hand-thank-you-with-love': HandThankYouWithLove,
  'hand-no-province-yet': HandNoProvinceYet,
  'canada-logo': CanadaLogo,
  'hand-reminder-red': HandReminderRed,
  'qr-code': QRCode,
};

export type IconName = keyof typeof ICONS;

export interface IconProps {
  name: IconName | undefined;
  size?: number;
  width?: number;
  height?: number;
}

export const Icon = ({name, size = 24, width, height}: IconProps) => {
  const IconImpl = name !== undefined ? ICONS[name] : null; // eslint-disable-line no-negated-condition
  return IconImpl ? <IconImpl width={width ? width : size} height={height ? height : size} /> : null;
};
