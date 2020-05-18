function pad(num: number, width: number, zero: string): string {
  const str = String(num);
  return str.length >= width ? str : new Array(width - str.length + 1).join(zero) + str;
}

export function utcISO8601Date(date: Date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getDate();
  return [String(year), pad(month, 2, '0'), pad(day, 2, '0')].join('-');
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 3600 * 24 * 1000);
}

export function hoursSinceEpoch(date: Date) {
  return date.getTime() / (1000 * 3600);
}

export function daysFromNow(date: Date) {
  const currentTime = Date.now();
  const oneDayMs = 1000 * 60 * 60 * 24;
  return Math.round((currentTime - date.getTime()) / oneDayMs);
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

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function daysBetween(date1: Date, date2: Date): number {
  return (startOfDay(date2).getTime() - startOfDay(date1).getTime()) / (1000 * 3600 * 24);
}
