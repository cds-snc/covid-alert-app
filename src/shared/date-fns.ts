export function addDays(date: Date, days: number) {
  // https://stackoverflow.com/questions/563406/add-days-to-javascript-date
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function hoursSinceEpoch(date: Date) {
  return date.getTime() / (1000 * 3600);
}

export function periodSinceEpoch(date: Date, hoursPerPeriod: number) {
  return Math.floor(date.getTime() / (1000 * 3600 * hoursPerPeriod));
}

export function hoursFromNow(date: Date) {
  const currentTime = Date.now();
  const oneHourMs = 1000 * 60 * 60;
  return Math.round((currentTime - date.getTime()) / oneHourMs);
}

export function minutesFromNow(date: Date) {
  const currentTime = Date.now();
  const oneMinuteMs = 1000 * 60;
  return Math.round((currentTime - date.getTime()) / oneMinuteMs);
}

export function secondsBetween(date1: Date, date2: Date): number {
  const oneSecondMs = 1000;
  return (date2.getTime() - date1.getTime()) / oneSecondMs;
}

export function minutesBetween(date1: Date, date2: Date): number {
  const oneMinuteMs = 1000 * 60;
  return (date2.getTime() - date1.getTime()) / oneMinuteMs;
}

export function daysBetween(date1: Date, date2: Date): number {
  const startDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const startDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return (startDate2.getTime() - startDate1.getTime()) / (1000 * 3600 * 24);
}

export function daysBetweenUTC(date1: Date, date2: Date): number {
  const startDate1 = new Date(Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate()));
  const startDate2 = new Date(Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate()));
  return (startDate2.getTime() - startDate1.getTime()) / (1000 * 3600 * 24);
}

export function getCurrentDate(): Date {
  return new Date();
}

export function getMillisSinceUTCEpoch() {
  return getCurrentDate().getTime();
}

export function getUploadDaysLeft(cycleEndsAt: number) {
  // cycleEndsAt = cycleEndsAtDate.getTime();
  const uploadDaysLeft = Math.round(daysBetween(getCurrentDate(), new Date(cycleEndsAt))) - 1;
  if (uploadDaysLeft < 0) {
    return 0;
  }
  return uploadDaysLeft;
}

export function getHoursBetween(date1: Date, date2: Date): number {
  const oneHourMs = 1000 * 60 * 60;
  const hrs = (date2.getTime() - date1.getTime()) / oneHourMs;
  return Math.round(hrs);
}

export function parseDateString(dateString: string) {
  if (!dateString) {
    return null;
  }
  const dateParts = dateString.split('-');
  return new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
}

export const formatExposedDate = (date: Date, locale: string) => {
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const _formattedDate = date.toLocaleString(locale, dateFormatOptions);
  const parts = _formattedDate.split(' ');
  const year = parts[2];

  // @note \u00a0 is a non breaking space so the date doesn't wrap
  // remove non-alpha chars from month
  if (locale === 'en-CA') {
    const month = parts[0].replace(/\W/g, '');
    const day = parts[1];
    return `${month}.\u00a0${day}\u00a0${year}`;
  } else if (locale === 'fr-CA') {
    const month = parts[1].replace(/\W/g, '');
    const day = parts[0];
    return `${day}\u00a0${month}.\u00a0${year}`;
  }
  return _formattedDate;
};

export const formatCheckInDate = (date: Date) => {
  const dateString = date.toLocaleString('default', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return dateString;
};

export const getFirstThreeUniqueDates = (formattedDates: string[]) => {
  return [...new Set(formattedDates)].slice(0, 3);
};

export const parseSavedTimestamps = (savedTimestamps: string) => {
  return savedTimestamps.split(',').map(x => Number(x));
};

export const getUTCMidnight = (date: Date) => {
  const midnight = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  return midnight.getTime();
};
