/* eslint-disable no-undef */
describe('Setup app and landing screen', () => {
  beforeEach(async () => {
    await device.launchApp({permissions: {notifications: 'YES'}});
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
    for (var i = 1; i < NUM_ONBOARDING_SCREENS; i++) {
      await expect(element(by.text(`Step ${i} of ${NUM_ONBOARDING_SCREENS}`))).toBeVisible();
      await expect(element(by.text('Next'))).toBeVisible();
      await device.takeScreenshot(`step ${i}`);
      await element(by.text('Next')).tap();
    }
    await device.takeScreenshot('step 6');
    await expect(element(by.text('Done'))).toBeVisible();
    await expect(element(by.id('step-6ScrollView'))).toBeVisible();
    await expect(element(by.id('AB'))).toBeVisible();
    await element(by.id('step-6ScrollView')).scrollTo('bottom');
    await expect(element(by.id('ON'))).toBeVisible();
    await element(by.id('ON')).tap();
    await element(by.text('Done')).tap();
  });
});
