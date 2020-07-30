/* eslint-disable no-undef */
const execSync = require('child_process').execSync;

describe('Setup app and landing screen', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('has landing screen', async () => {
    await device.launchApp({permissions: {notifications: 'YES'}});
    await expect(element(by.id('enButton'))).toBeVisible();
    await expect(element(by.id('frButton'))).toBeVisible();
    await element(by.id('enButton')).tap();
  });
});

const setDemoMode = () => {
  if (device.getPlatform() === 'ios') {
    execSync(
      'xcrun simctl status_bar "iPhone 11" override --time "12:00" --batteryState charged --batteryLevel 100 --wifiBars 3 --cellularMode active --cellularBars 4',
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

const NUM_ONBOARDING_SCREENS = 6;
describe('Test onboarding flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('has onboarding screens', async () => {
    setDemoMode();
    for (let i = 1; i < NUM_ONBOARDING_SCREENS; i++) {
      await expect(element(by.text(`Step ${i} of ${NUM_ONBOARDING_SCREENS}`))).toBeVisible();
      await expect(element(by.id('nextButton'))).toBeVisible();
      await device.takeScreenshot(`step-${i}`);
      await element(by.id('nextButton')).tap();
    }
    const finalStep = `step-${NUM_ONBOARDING_SCREENS}`;
    await device.takeScreenshot(finalStep);
    await expect(element(by.id(`${finalStep}ScrollView`))).toBeVisible();
    await expect(element(by.id('AB'))).toBeVisible();
    await element(by.id(`${finalStep}ScrollView`)).scrollTo('bottom');
    await expect(element(by.id('ON'))).toBeVisible();
    await element(by.id('ON')).tap();
    await element(by.id('nextButton')).tap();
  });
});

describe('Test Home flow', () => {
  it('has a home screen', async () => {
    await expect(element(by.id('UnknownProblem'))).toBeVisible();
    await device.takeScreenshot(`UnknownProblem`);
    await element(by.id('headerButton')).tap();
    await element(by.id('ExposureView')).tap();
    await element(by.id('headerButton')).tap();
    await device.takeScreenshot(`ExposureView`);
  });
});
