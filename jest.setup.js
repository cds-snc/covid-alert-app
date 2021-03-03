import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);
jest.mock('react-native-fs', () => ({
  readFile: jest.fn(),
}));
