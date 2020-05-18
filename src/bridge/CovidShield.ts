import {Buffer} from 'buffer';

import {NativeModules} from 'react-native';

const CoviedShieldBridgeBare = NativeModules.CovidShield as {
  downloadDiagnosisKeysFiles(url: string): Promise<string[]>;
  getRandomBytes(size: number): Promise<string>;
};

export interface CoviedShieldBridge {
  downloadDiagnosisKeysFiles(url: string): Promise<string[]>;
  getRandomBytes(size: number): Promise<Buffer>;
}

export const downloadDiagnosisKeysFiles = CoviedShieldBridgeBare.downloadDiagnosisKeysFiles;

export const getRandomBytes = async (size: number) => {
  const base64encoded = await CoviedShieldBridgeBare.getRandomBytes(size);
  return Buffer.from(base64encoded, 'base64');
};
