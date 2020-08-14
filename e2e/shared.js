/* eslint-disable no-undef */
const execSync = require('child_process').execSync;

const NUM_ONBOARDING_SCREENS = 6;

export const setDemoMode = () => {
  if (device.getPlatform() === 'ios') {
    execSync(
      'xcrun simctl status_bar "iPhone 8" override --time "12:00" --batteryState charged --batteryLevel 100 --wifiBars 3 --cellularMode active --cellularBars 4',
    );
  } else {
    // enter demo mode
    execSync('adb shell settings put global sysui_demo_allowed 1');
    // display time 12:00
    execSync('adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 1200');
    // Display full mobile data with 4g type and no wifi
    execSync(
      'adb shell am broadcast -a com.android.systemui.demo -e command network -e mobile show -e level 4 -e datatype 4g -e wifi false',
    );
    // Hide notifications
    execSync('adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false');
    // Show full battery but not in charging state
    execSync('adb shell am broadcast -a com.android.systemui.demo -e command battery -e plugged false -e level 100');
  }
};

export const onboard = async () => {
  await device.launchApp({permissions: {notifications: 'YES'}});
  await expect(element(by.id('enButton'))).toBeVisible();
  await element(by.id('enButton')).tap();
  setDemoMode();
  for (let i = 1; i <= NUM_ONBOARDING_SCREENS; i++) {
    await expect(element(by.id('onboardingNextButton'))).toBeVisible();
    await element(by.id('onboardingNextButton')).tap();
  }
};
