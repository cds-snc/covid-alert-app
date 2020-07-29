import {
  daysBetweenUTC,
  addDays,
  hoursSinceEpoch,
  daysFromNow,
  hoursFromNow,
  minutesFromNow,
  minutesBetween,
} from './date-fns';

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

  describe('addDays', () => {
    const now = new Date();

    it('returns date 1 day from now if 1 day was added', () => {
      expect(addDays(now, 1).getTime() - now.getTime()).toStrictEqual(86400 * 1000);
    });

    it('returns the same date if 0 days was added', () => {
      expect(addDays(now, 0)).toStrictEqual(now);
    });
  });

  describe('hoursSinceEpoch', () => {
    it('returns 1 for date which is 1 hour since the epoch', () => {
      expect(hoursSinceEpoch(new Date('1970-01-01 01:00:00 GMT+0000'))).toStrictEqual(1);
    });

    it('returns 0 for the epoch', () => {
      expect(hoursSinceEpoch(new Date('1970-01-01 00:00:00 GMT+0000'))).toStrictEqual(0);
    });

    it('returns 25.5 for 1:30 first day after epoch', () => {
      expect(hoursSinceEpoch(new Date('1970-01-02 01:30:00 GMT+0000'))).toStrictEqual(25.5);
    });
  });

  describe('daysFromNow', () => {
    let now;

    beforeEach(() => {
      now = jest.spyOn(Date, 'now').mockImplementation(() => new Date('2020-07-07 00:01:00 GMT+0200'));
    });

    afterEach(() => {
      now.mockReset();
    });

    it('returns 1 if the date is within 24h in past', () => {
      const date = new Date('2020-07-06 00:01:01 GMT+0200');
      expect(daysFromNow(date)).toStrictEqual(1);
    });

    it('returns -1 if the date is within 24h in future', () => {
      const date = new Date('2020-07-07 23:59:59 GMT+0200');
      expect(daysFromNow(date)).toStrictEqual(-1);
    });

    it('returns 0 if the date is exactly the current time', () => {
      expect(daysFromNow(now())).toStrictEqual(0);
    });
  });

  describe('hoursFromNow', () => {
    let now;

    beforeEach(() => {
      now = jest.spyOn(Date, 'now').mockImplementation(() => new Date('2020-07-07 00:01:00 GMT+0200'));
    });

    afterEach(() => {
      now.mockReset();
    });

    it('returns 1 if the date is between 60  and 120 minutes in past', () => {
      const date = new Date('2020-07-06 22:32:00 GMT+0200');
      expect(hoursFromNow(date)).toStrictEqual(1);
    });

    it('returns -1 if the date is within 60 minutes in future', () => {
      const date = new Date('2020-07-07 00:59:59 GMT+0200');
      expect(hoursFromNow(date)).toStrictEqual(-1);
    });

    it('returns 0 if the date is exactly the current time', () => {
      expect(hoursFromNow(now())).toStrictEqual(0);
    });
  });

  describe('minutesFromNow', () => {
    let now;

    beforeEach(() => {
      now = jest.spyOn(Date, 'now').mockImplementation(() => new Date('2020-07-07 00:01:00 GMT+0200'));
    });

    afterEach(() => {
      now.mockReset();
    });

    it('returns 1 if the date is within 60 seconds in past', () => {
      const date = new Date('2020-07-07 00:00:00 GMT+0200');
      expect(minutesFromNow(date)).toStrictEqual(1);
    });

    it('returns 2 if the date is 100 seconds in past', () => {
      const date = new Date('2020-07-06 23:59:20 GMT+0200');
      expect(minutesFromNow(date)).toStrictEqual(2);
    });

    it('returns -3 if the date is 3 minutes in future', () => {
      const date = new Date('2020-07-07 00:04:00 GMT+0200');
      expect(minutesFromNow(date)).toStrictEqual(-3);
    });

    it('returns 0 if the date is exactly the current time', () => {
      expect(minutesFromNow(now())).toStrictEqual(0);
    });
  });

  describe('minutesBetween', () => {
    it('returns 0 when comparing the same dates', () => {
      const d1 = new Date('2020-07-06 00:00:01 GMT+0600');
      const d2 = new Date('2020-07-06 00:00:01 GMT+0600');
      expect(minutesBetween(d1, d2)).toStrictEqual(0);
    });

    it('returns 2 if second argument is exactly 2 minutes later than first', () => {
      const d1 = new Date('2020-07-06 00:00:01 GMT+0600');
      const d2 = new Date('2020-07-06 00:02:01 GMT+0600');
      expect(minutesBetween(d1, d2)).toStrictEqual(2);
    });

    it('returns -60 if second argument is exactly 1 hour earlier than first', () => {
      const d1 = new Date('2020-07-06 00:00:01 GMT+0600');
      const d2 = new Date('2020-07-05 23:00:01 GMT+0600');
      expect(minutesBetween(d1, d2)).toStrictEqual(-60);
    });

    it('returns timezone offset difference for the same time in different timezones', () => {
      const d1 = new Date('2020-07-06 00:00:01 GMT+0600');
      const d2 = new Date('2020-07-06 00:00:01 GMT+0500');
      expect(minutesBetween(d1, d2)).toStrictEqual(60);
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
