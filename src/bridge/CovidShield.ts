import {Buffer} from 'buffer';

import {NativeModules} from 'react-native';

const CoviedShieldBridgeBare = NativeModules.CovidShield as {
  downloadDiagnosisKeysFile(url: string): Promise<string>;
  getRandomBytes(size: number): Promise<string>;
};

export interface CoviedShieldBridge {
  downloadDiagnosisKeysFile(url: string): Promise<string>;
  getRandomBytes(size: number): Promise<Buffer>;
}

export const downloadDiagnosisKeysFile = CoviedShieldBridgeBare.downloadDiagnosisKeysFile;

export const getRandomBytes = async (size: number) => {
  const base64encoded = await CoviedShieldBridgeBare.getRandomBytes(size);
  return Buffer.from(base64encoded, 'base64');
};
