export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 3600 * 24 * 1000);
}

export function hoursSinceEpoch(date: Date) {
  return date.getTime() / (1000 * 3600);
}

export function periodSinceEpoch(date: Date) {
  return Math.floor(date.getTime() / (1000 * 3600 * 2)) * 2;
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
