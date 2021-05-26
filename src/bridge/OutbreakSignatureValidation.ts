import {NativeModules} from 'react-native';

const OutbreakSignatureValidationBridge = NativeModules.OutbreakSignatureValidation as {
  isSignatureValid(packageMessage: string, packageSignature: string): Promise<boolean>;
};

export function isOutbreakSignatureValid(packageMessage: string, packageSignature: string): Promise<boolean> {
  return OutbreakSignatureValidationBridge.isSignatureValid(packageMessage, packageSignature);
}
