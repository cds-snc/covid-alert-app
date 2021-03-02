import {ServerTimeService} from '../BackendService';

import {
  ServerTimeBasedExposureCheckTrigger,
  DefaultServerTimeBasedExposureCheckTrigger,
} from './ServerTimeBasedExposureCheckTrigger';

const serverTimeService: ServerTimeService = {
  getTime: jest.fn(),
};

describe('ServerTimeBasedExposureCheckTrigger', () => {
  let sut: ServerTimeBasedExposureCheckTrigger;

  const OriginalDate = global.Date;
  const realDateNow = Date.now.bind(global.Date);
  const realDateUTC = Date.UTC.bind(global.Date);
  let currentDate = new OriginalDate('2019-01-01T12:00:00.000Z');
  const dateSpy = jest.spyOn(global, 'Date');
  dateSpy.mockImplementation((...args: any[]) => (args.length > 0 ? new OriginalDate(...args) : currentDate));
  global.Date.now = realDateNow;
  global.Date.UTC = realDateUTC;

  beforeEach(() => {
    sut = new DefaultServerTimeBasedExposureCheckTrigger(serverTimeService);
    serverTimeService.getTime.mockReturnValue(Promise.resolve(new Date()));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shouldPerformExposureCheck returns false if local time is 29.9 minutes behind server time', async () => {
    currentDate = new OriginalDate('2019-01-01T12:00:00.000Z');

    serverTimeService.getTime.mockReturnValue(Promise.resolve(new Date('2019-01-01T12:29:59.999Z')));

    const result = await sut.shouldPerformExposureCheck();
    expect(result).toStrictEqual(false);
  });

  it('shouldPerformExposureCheck returns false if local time is 29.9 minutes ahead of server time', async () => {
    currentDate = new OriginalDate('2019-01-01T12:29:59.999Z');

    serverTimeService.getTime.mockReturnValue(Promise.resolve(new Date('2019-01-01T12:00:00.000Z')));

    const result = await sut.shouldPerformExposureCheck();
    expect(result).toStrictEqual(false);
  });

  it('shouldPerformExposureCheck returns true is local time is 30 minutes behind server time', async () => {
    currentDate = new OriginalDate('2019-01-01T12:00:00.000Z');

    serverTimeService.getTime.mockReturnValue(Promise.resolve(new Date('2019-01-01T12:30:00.000Z')));

    const result = await sut.shouldPerformExposureCheck();
    expect(result).toStrictEqual(true);
  });

  it('shouldPerformExposureCheck returns true is local time is 30 minutes ahead of server time', async () => {
    currentDate = new OriginalDate('2019-01-01T12:30:00.000Z');

    serverTimeService.getTime.mockReturnValue(Promise.resolve(new Date('2019-01-01T12:00:00.000Z')));

    const result = await sut.shouldPerformExposureCheck();
    expect(result).toStrictEqual(true);
  });

  it('shouldPerformExposureCheck returns false if time cannot be fetched from server', async () => {
    currentDate = new OriginalDate('2019-01-01T12:30:00.000Z');

    serverTimeService.getTime.mockReturnValue(Promise.resolve(null));

    const result = await sut.shouldPerformExposureCheck();
    expect(result).toStrictEqual(false);
  });

  it('server time caching mechanism kicks in if shouldPerformExposureCheck is called with a delay of 4.9 minutes in between', async () => {
    currentDate = new OriginalDate('2019-01-01T12:00:00.000Z');
    await sut.shouldPerformExposureCheck();

    currentDate = new OriginalDate('2019-01-01T12:04:59.999Z');
    await sut.shouldPerformExposureCheck();

    expect(serverTimeService.getTime).toHaveBeenCalledTimes(1);
  });

  it('server time caching mechanism is not used if shouldPerformExposureCheck is called with a delay of 5 minutes in between', async () => {
    currentDate = new OriginalDate('2019-01-01T12:00:00.000Z');
    await sut.shouldPerformExposureCheck();

    currentDate = new OriginalDate('2019-01-01T12:05:00.000Z');
    await sut.shouldPerformExposureCheck();

    expect(serverTimeService.getTime).toHaveBeenCalledTimes(2);
  });
});
