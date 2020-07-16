export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 3600 * 24 * 1000);
}

export function hoursSinceEpoch(date: Date) {
  return date.getTime() / (1000 * 3600);
}

export function periodSinceEpoch(date: Date, hoursPerPeriod: number) {
  return Math.floor(date.getTime() / (1000 * 3600 * hoursPerPeriod));
}

export function daysFromNow(date: Date) {
  const oneDayMs = 1000 * 60 * 60 * 24;
  return Math.round((getMillisSinceUTCEpoch() - date.getTime()) / oneDayMs);
}

export function hoursFromNow(date: Date) {
  const oneHourMs = 1000 * 60 * 60;
  return Math.round((getMillisSinceUTCEpoch() - date.getTime()) / oneHourMs);
}

export function minutesFromNow(date: Date) {
  const oneMinuteMs = 1000 * 60;
  return Math.round((getMillisSinceUTCEpoch() - date.getTime()) / oneMinuteMs);
}

export function minutesBetween(date1: Date, date2: Date): number {
  const oneMinuteMs = 1000 * 60;
  return (date2.getTime() - date1.getTime()) / oneMinuteMs;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function daysBetween(date1: Date, date2: Date): number {
  return (startOfDay(date2).getTime() - startOfDay(date1).getTime()) / (1000 * 3600 * 24);
}

export function getCurrentDate(): Date {
  return new Date();
}

export function getMillisSinceUTCEpoch(): number {
  return getCurrentDate().getTime();
}
