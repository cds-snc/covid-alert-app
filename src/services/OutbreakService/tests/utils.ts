export const getTimes = (startTimestamp: number, durationInMinutes: number) => {
  const endTime = new Date(startTimestamp);
  endTime.setMinutes(endTime.getMinutes() + durationInMinutes);
  return {start: startTimestamp, end: endTime.getTime()};
};

export const subtractHours = (startTimestamp: number, hours: number) => {
  const newTime = new Date(startTimestamp);
  newTime.setHours(newTime.getHours() - hours);
  return newTime.getTime();
};

export const addHours = (startTimestamp: number, hours: number) => {
  const newTime = new Date(startTimestamp);
  newTime.setHours(newTime.getHours() + hours);
  return newTime.getTime();
};

export const addMinutes = (startTimestamp: number, minutes: number) => {
  const newTime = new Date(startTimestamp);
  newTime.setMinutes(newTime.getMinutes() + minutes);
  return newTime.getTime();
};

export const subtractMinutes = (startTimestamp: number, minutes: number) => {
  const newTime = new Date(startTimestamp);
  newTime.setMinutes(newTime.getMinutes() - minutes);
  return newTime.getTime();
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
  {
    id: '130',
    timestamp: new Date('2021-02-01T04:10:00Z').getTime(),
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
  {
    id: '130',
    timestamp: new Date('2021-02-04T13:00:00Z').getTime(),
    address: '123 King St.',
    name: 'Location name',
  },
];
