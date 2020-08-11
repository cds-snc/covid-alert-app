/* eslint-disable no-undef */
import {setDemoMode} from './shared';

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
