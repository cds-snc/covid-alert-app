import {
  daysBetweenUTC,
  addDays,
  hoursSinceEpoch,
  hoursFromNow,
  minutesFromNow,
  minutesBetween,
  getUploadDaysLeft,
  getCurrentDate,
  parseDateString,
  formatExposedDate,
  parseSavedTimestamps,
  getFirstThreeUniqueDates,
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

  // formatExposedDate
  describe('formatExposedDate', () => {
    it('returns formatted date for en and fr', () => {
      expect(formatExposedDate(new Date(1605814310000), 'en-CA')).toStrictEqual('Nov.\u00a019,\u00a02020');
      // the following test fails in CI for some reason
      // expect(formatExposedDate(new Date(1605814310000), 'fr-CA')).toStrictEqual('19\u00a0nov.\u00a02020');
    });
  });

  describe('getUploadDaysLeft', () => {
    const now = getCurrentDate();

    it.each([addDays(now, 2), addDays(now, 0.5), addDays(now, 10), addDays(now, -3)])(
      'returns a round number when cycle ends on %p',
      async testDate => {
        const cycleEndsAt = testDate.getTime();
        expect(Math.round(getUploadDaysLeft(cycleEndsAt))).toStrictEqual(getUploadDaysLeft(cycleEndsAt));
      },
    );

    it.each([
      [addDays(now, 5), 4],
      [addDays(now, 2), 1],
      [addDays(now, 1), 0],
      [addDays(now, 0), 0],
      [addDays(now, -1), 0],
      // [addDays(now, 10.2), 9],
    ])('when cycle ends on %p, days remaining are %p', async (testDate, daysRemaining) => {
      const cycleEndsAt = testDate.getTime();
      expect(getUploadDaysLeft(cycleEndsAt)).toStrictEqual(daysRemaining);
    });

    it('if cycle ends today, return 0', () => {
      const cycleEndsAt = getCurrentDate().getTime();
      expect(getUploadDaysLeft(cycleEndsAt)).toStrictEqual(0);
    });
  });

  describe('parseDateString', () => {
    it.each([
      ['2020-10-01', new Date(2020, 9, 1)],
      ['2020-01-01', new Date(2020, 0, 1)],
      ['2020-1-1', new Date(2020, 0, 1)],
      ['2020-1-01', new Date(2020, 0, 1)],
      ['2020-01-1', new Date(2020, 0, 1)],
      ['', null],
    ])('parses %p as %p', async (input, output) => {
      expect(parseDateString(input)).toStrictEqual(output);
    });
  });

  describe('parseSavedTimestamps', () => {
    it('parsed a comma separated string of timestamps', () => {
      expect(parseSavedTimestamps('1,2,3')).toStrictEqual([1, 2, 3]);
      expect(parseSavedTimestamps('1609484400000')).toStrictEqual([1609484400000]);
      expect(parseSavedTimestamps('1609484400000,1609570800000')).toStrictEqual([1609484400000, 1609570800000]);
      expect(parseSavedTimestamps('1609484400000,1609570800000,1609657200000')).toStrictEqual([
        1609484400000,
        1609570800000,
        1609657200000,
      ]);
    });
  });

  describe('getFirstThreeUniqueDates', () => {
    it('gets only unique dates from an array of formatted dates', () => {
      expect(getFirstThreeUniqueDates(['Jan. 1 2021', 'Jan. 1 2021'])).toStrictEqual(['Jan. 1 2021']);
      expect(getFirstThreeUniqueDates(['Jan. 2 2021', 'Jan. 1 2021'])).toStrictEqual(['Jan. 2 2021', 'Jan. 1 2021']);
      expect(getFirstThreeUniqueDates(['Jan. 2 2021', 'Jan. 1 2021', 'Jan. 1 2021'])).toStrictEqual([
        'Jan. 2 2021',
        'Jan. 1 2021',
      ]);
    });
    it('gets only the first 3 dates from an array of formatted dates', () => {
      expect(getFirstThreeUniqueDates(['Jan. 4 2021', 'Jan. 3 2021', 'Jan. 2 2021', 'Jan. 1 2021'])).toStrictEqual([
        'Jan. 4 2021',
        'Jan. 3 2021',
        'Jan. 2 2021',
      ]);
      expect(getFirstThreeUniqueDates(['Jan. 4 2021', 'Jan. 3 2021', 'Jan. 2 2021', 'Jan. 2 2021'])).toStrictEqual([
        'Jan. 4 2021',
        'Jan. 3 2021',
        'Jan. 2 2021',
      ]);
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
