import {Buffer} from 'buffer';

import {NativeModules} from 'react-native';

const CovidShieldBridgeBare = NativeModules.CovidShield as {
  downloadDiagnosisKeysFile(url: string): Promise<string>;
  getRandomBytes(size: number): Promise<string>;
};

export interface CovidShieldBridge {
  downloadDiagnosisKeysFile(url: string): Promise<string>;
  getRandomBytes(size: number): Promise<Buffer>;
}

export const downloadDiagnosisKeysFile = CovidShieldBridgeBare.downloadDiagnosisKeysFile;

export const getRandomBytes = async (size: number) => {
  const base64encoded = await CovidShieldBridgeBare.getRandomBytes(size);
  return Buffer.from(base64encoded, 'base64');
};
