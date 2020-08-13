/* eslint-disable no-undef */
import {setDemoMode} from './shared';

const changeRegion = async region => {
  // should be called from the home screen
  await element(by.id('tapPromptCollapsed')).tap();
  await element(by.id('changeRegion')).tap();
  await waitFor(element(by.id(`RegionPickerSettings-${region}`)))
    .toBeVisible()
    .whileElement(by.id('RegionPickerSettings-ScrollView'))
    .scroll(50, 'down');
  await element(by.id(`RegionPickerSettings-${region}`)).tap();
  await element(by.id('toolbarCloseButton')).tap();
  await element(by.id('bottom-sheet-close')).tap();
};

const changeScreen = async screenName => {
  await element(by.id('headerButton')).tap();
  await element(by.id(screenName)).tap();
  await element(by.id(screenName)).swipe('right');
};

const NUM_ONBOARDING_SCREENS = 6;
describe('Test province flow', () => {
  it('pass through onboarding flow', async () => {
    await device.launchApp({permissions: {notifications: 'YES'}});
    await expect(element(by.id('enButton'))).toBeVisible();
    await element(by.id('enButton')).tap();
    setDemoMode();
    for (let i = 1; i <= NUM_ONBOARDING_SCREENS; i++) {
      await expect(element(by.id('onboardingNextButton'))).toBeVisible();
      await element(by.id('onboardingNextButton')).tap();
    }
  });

  it('lands on the right home screen', async () => {
    // eslint-disable-next-line jest/no-if
    if (device.getPlatform() === 'android') {
      await expect(element(by.id('exposureNotificationsDisabled'))).toBeVisible();
      await device.takeScreenshot(`ExposureNotificationsDisabled`);
    } else {
      await expect(element(by.id('unknownProblem'))).toBeVisible();
      await device.takeScreenshot(`UnknownProblem`);
    }
  });

  it('displays the right exposure view for ON and AB', async () => {
    await changeScreen('ExposureView');
    await expect(element(by.id('exposure'))).toBeVisible();
    await changeRegion('ON');
    await device.takeScreenshot('Exposure-ON-top');
    await element(by.id('exposure')).swipe('up');
    await device.takeScreenshot('Exposure-ON-bottom');
    await expect(element(by.text('Find out what to do next'))).toBeVisible();
    await changeRegion('AB');
    await device.takeScreenshot('Exposure-AB-top');
    await element(by.id('exposure')).swipe('up');
    await device.takeScreenshot('Exposure-AB-bottom');
    await expect(element(by.text('Find out if you need to be tested'))).toBeVisible();
  });
  it('can display the diagnosed view', async () => {
    await changeScreen('DiagnosedShareView');
    await expect(element(by.id('diagnosedShare'))).toBeVisible();
    await device.takeScreenshot('DiagnosedShare');
  });
});
