/* eslint-disable no-undef */
const execSync = require('child_process').execSync;

const setDemoMode = () => {
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

describe('Setup app and landing screen', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('has landing screen', async () => {
    await expect(element(by.id('enButton'))).toBeVisible();
    await expect(element(by.id('frButton'))).toBeVisible();
  });
});

const NUM_ONBOARDING_SCREENS = 6;

const ctaScreens = {
  howItWorks: {key: 'howItWorks', step: 3, screens: 4},
  privacyPolicy: {key: 'privacyPolicy', step: 5},
};

describe('Test onboarding flow', () => {
  beforeEach(async () => {
    await device.relaunchApp({delete: true, permissions: {notifications: 'YES'}});
    setDemoMode();
  });

  it('has onboarding screens', async () => {
    await expect(element(by.id('enButton'))).toBeVisible();
    await element(by.id('enButton')).tap();
    // Loop through onboarding carousel
    for (let i = 1; i < NUM_ONBOARDING_SCREENS; i++) {
      await expect(element(by.text(`Step ${i} of ${NUM_ONBOARDING_SCREENS}`))).toBeVisible();
      await expect(element(by.id('onboardingNextButton'))).toBeVisible();
      await device.takeScreenshot(`onboarding-step-${i}-top`);
      await expect(element(by.id(`step-${i}OnboardingScrollView`))).toBeVisible();
      await element(by.id(`step-${i}OnboardingScrollView`)).scrollTo('bottom');
      await device.takeScreenshot(`onboarding-step-${i}-bottom`);
      await element(by.id('onboardingNextButton')).tap();
    }
    // Finish onboarding with region picker
    const finalStep = `step-${NUM_ONBOARDING_SCREENS}`;
    await device.takeScreenshot(`onboarding-${finalStep}-top`);
    await expect(element(by.id(`${finalStep}OnboardingScrollView`))).toBeVisible();
    await expect(element(by.id('AB'))).toBeVisible();
    await element(by.id(`${finalStep}OnboardingScrollView`)).scrollTo('bottom');
    await device.takeScreenshot(`onboarding-${finalStep}-bottom`);
    await expect(element(by.id('ON'))).toBeVisible();
    await element(by.id('ON')).tap();
    await element(by.id('onboardingNextButton')).tap();
  });

  it('has how it works screen', async () => {
    await expect(element(by.id('enButton'))).toBeVisible();
    await element(by.id('enButton')).tap();

    const howItWorks = ctaScreens.howItWorks;
    // Go through onboarding until we hit how it works
    for (let i = 1; i < howItWorks.step; i++) {
      await expect(element(by.id('onboardingNextButton'))).toBeVisible();
      await element(by.id('onboardingNextButton')).tap();
    }
    // Scroll to the bottom to hit the CTA
    await expect(element(by.id(`step-${howItWorks.step}OnboardingScrollView`))).toBeVisible();
    await element(by.id(`step-${howItWorks.step}OnboardingScrollView`)).scrollTo('bottom');
    await expect(element(by.id(`${howItWorks.key}CTA`))).toBeVisible();
    await element(by.id(`${howItWorks.key}CTA`)).tap();

    // Loop through carousel
    for (let j = 1; j <= howItWorks.screens; j++) {
      await device.takeScreenshot(`${howItWorks.key}-step-${j}-top`);
      await element(by.id(`step-${j}${howItWorks.key}ScrollView`)).scrollTo('bottom');
      await device.takeScreenshot(`${howItWorks.key}-step-${j}-bottom`);
      await element(by.id(`${howItWorks.key}NextButton`)).tap();
    }
  });

  it('has privacy policy screen', async () => {
    await expect(element(by.id('enButton'))).toBeVisible();
    await element(by.id('enButton')).tap();

    const privacyPolicy = ctaScreens.privacyPolicy;
    // Go through onboarding until we hit how it works
    for (let i = 1; i < privacyPolicy.step; i++) {
      await expect(element(by.id('onboardingNextButton'))).toBeVisible();
      await element(by.id('onboardingNextButton')).tap();
    }
    // Scroll to the bottom to hit the CTA
    await expect(element(by.id(`step-${privacyPolicy.step}OnboardingScrollView`))).toBeVisible();
    await element(by.id(`step-${privacyPolicy.step}OnboardingScrollView`)).scrollTo('bottom');
    await expect(element(by.id(`${privacyPolicy.key}CTA`))).toBeVisible();
    await element(by.id(`${privacyPolicy.key}CTA`)).tap();

    // Scroll to bottom of scroll view and exit
    await device.takeScreenshot(`${privacyPolicy.key}-top`);
    await element(by.id(`${privacyPolicy.key}ScrollView`)).scrollTo('bottom');
    await device.takeScreenshot(`${privacyPolicy.key}-bottom`);
    await element(by.id(`toolbarCloseButton`)).tap();
  });
});
