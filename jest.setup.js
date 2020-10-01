import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock';
import {Platform} from 'react-native';
import {TEST_OS} from 'env';

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);
console.log('hi');

if (['ios', 'android'].indexOf(TEST_OS) > -1) {
  Platform.OS = TEST_OS;
  console.log('hi');
} else {
  Platform.OS = 'ios';
}
