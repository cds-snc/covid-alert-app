import {NativeModules} from 'react-native';

const OutbreakSignatureValidationBridge = NativeModules.OutbreakSignatureValidation as {
  isSignatureValid(message: string, signature: string): Promise<boolean>;
};

export function isOutbreakSignatureValid(message: string, signature: string): Promise<boolean> {
  return OutbreakSignatureValidationBridge.isSignatureValid(message, signature);
}
