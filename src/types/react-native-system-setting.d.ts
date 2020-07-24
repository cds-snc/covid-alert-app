declare module 'react-native-system-setting' {
  interface Listener {
    remove();
  }

  interface SystemSetting {
    addBluetoothListener(callback: (enabled: boolean) => void): Promise<Listener>;
    addLocationListener(callback: (enabled: boolean) => void): Promise<Listener>;
  }

  const systemSetting: SystemSetting;

  export default systemSetting;
}
