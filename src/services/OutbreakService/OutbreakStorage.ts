// eslint-disable-next-line @shopify/strict-component-boundaries
import {DefaultSecureKeyValueStore} from '../MetricsService/SecureKeyValueStorage';

const OutbreaksLastCheckedStorageKey = 'A436ED42-707E-11EB-9439-0242AC130002';

const secureKeyValueStore = new DefaultSecureKeyValueStore();

export const getOutbreaksLastCheckedDateTime = async () => {
  const value = await secureKeyValueStore.retrieve(OutbreaksLastCheckedStorageKey);
  return value ? new Date(Number(value)) : null;
};

export const markOutbreaksLastCheckedDateTime = (date: Date) => {
  return secureKeyValueStore.save(OutbreaksLastCheckedStorageKey, `${date.getTime()}`);
};
