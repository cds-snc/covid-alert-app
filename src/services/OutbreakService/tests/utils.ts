export const getTimes = (startTimestamp: number, durationInMinutes: number) => {
  const endTime = new Date(startTimestamp);
  endTime.setMinutes(endTime.getMinutes() + durationInMinutes);
  return {start: startTimestamp, end: endTime.getTime()};
};

export const checkIns = [
  {
    id: '123',
    timestamp: new Date('2021-02-01T12:00Z').getTime(),
    address: '123 King St.',
    name: 'Location name',
  },
  {
    id: '124',
    timestamp: new Date('2021-02-01T14:00Z').getTime(),
    address: '123 King St.',
    name: 'Location name',
  },
  {
    id: '125',
    timestamp: new Date('2021-02-04T12:00Z').getTime(),
    address: '123 King St.',
    name: 'Location name',
  },
];

export const outbreaks = [
  {
    locationId: '123',
    startTime: new Date('2021-02-01T09:00Z').getTime(),
    endTime: new Date('2021-02-01T16:00Z').getTime(),
    severity: 1,
  },
  {
    locationId: '456',
    startTime: null,
    endTime: null,
    severity: 1,
  },
  {
    locationId: '123',
    startTime: new Date('2021-03-01T09:00Z').getTime(),
    endTime: new Date('2021-03-01T16:00Z').getTime(),
    severity: 1,
  },
];
