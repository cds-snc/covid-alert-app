/* eslint-disable no-undef */
import {setDemoMode} from './shared';

const NUM_ONBOARDING_SCREENS = 6;
describe('Test province flow', () => {
  it('pass through onboarding flow', async () => {
    await device.launchApp({permissions: {notifications: 'YES'}});
    await expect(element(by.id('enButton'))).toBeVisible();
    await element(by.id('enButton')).tap();
    setDemoMode();
    for (let i = 1; i <= NUM_ONBOARDING_SCREENS; i++) {
      await expect(element(by.id('nextButton'))).toBeVisible();
      await element(by.id('nextButton')).tap();
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

  it('can display the exposure view', async () => {
    await element(by.id('headerButton')).tap();
    await element(by.id('ExposureView')).tap();
    await element(by.id('ExposureView')).swipe('right');
    await expect(element(by.id('exposure'))).toBeVisible();
    await device.takeScreenshot(`Exposure`);
  });

  it('can display the diagnosed view', async () => {
    await element(by.id('headerButton')).tap();
    await element(by.id('DiagnosedShareView')).tap();
    await element(by.id('DiagnosedShareView')).swipe('right');
    await expect(element(by.id('diagnosedShare'))).toBeVisible();
    await device.takeScreenshot(`DiagnosedShare`);
  });
});
