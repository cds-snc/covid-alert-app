import {daysBetweenUTC} from './date-fns';

/**
 * These tests have to run in non UTC timezone.
 * Temporary disable on CI for now
 */
describe('date-fns', () => {
  describe('daysBetweenUTC', () => {
    it('returns 0 if two dates are in same UTC date', () => {
      expect(
        daysBetweenUTC(new Date('Wed Jul 14 2020 20:00:01 GMT-0400'), new Date('Wed Jul 15 2020 19:59:59 GMT-0400')),
      ).toStrictEqual(0);
    });

    it('returns 1 if two dates are in different UTC date by 1', () => {
      expect(
        daysBetweenUTC(new Date('Wed Jul 14 2020 20:00:01 GMT-0400'), new Date('Wed Jul 15 2020 20:00:00 GMT-0400')),
      ).toStrictEqual(1);

      expect(
        daysBetweenUTC(new Date('Wed Jul 14 2020 20:00:01 GMT-0400'), new Date('Wed Jul 16 2020 19:59:59 GMT-0400')),
      ).toStrictEqual(1);
    });

    it('returns 2 if two dates are in different UTC date by 2', () => {
      expect(
        daysBetweenUTC(new Date('Wed Jul 14 2020 20:00:01 GMT-0400'), new Date('Wed Jul 16 2020 20:00:00 GMT-0400')),
      ).toStrictEqual(2);
    });
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  // it('returns 1 missing day for keys upload', () => {
  //   const today = new Date('Wed Jul 28 2020 00:00:00 GMT-0400');
  //   const cycleStartsAt = new Date('Wed Jul 14 2020 20:00:00 GMT-0400');
  //   const cycleEndsAt = addDays(cycleStartsAt, 14);
  //   expect(daysBetween(today, cycleEndsAt)).toStrictEqual(0);
  //   expect(daysBetweenUTC(today, cycleEndsAt)).toStrictEqual(1);
  // });

  // eslint-disable-next-line jest/no-commented-out-tests
  // it('returns 0 missing day for keys upload', () => {
  //   const today = new Date('Wed Jul 28 2020 00:00:00 GMT-0400');
  //   const cycleStartsAt = new Date('Wed Jul 14 2020 19:00:00 GMT-0400');
  //   const cycleEndsAt = addDays(cycleStartsAt, 14);
  //   expect(daysBetween(today, cycleEndsAt)).toStrictEqual(0);
  //   expect(daysBetweenUTC(today, cycleEndsAt)).toStrictEqual(0);
  // });
});
