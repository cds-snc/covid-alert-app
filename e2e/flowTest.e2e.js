/* eslint-disable no-undef */
const NUM_ONBOARDING_SCREENS = 6;
describe('Test flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('has landing screen', async () => {
    await expect(element(by.id('enButton'))).toBeVisible();
    await expect(element(by.id('frButton'))).toBeVisible();
    await element(by.id('enButton')).tap();
  });

  it('has onboarding screens', async () => {
    for (var i = 1; i <= NUM_ONBOARDING_SCREENS; i++) {
      await expect(element(by.text(`Step ${i} of ${NUM_ONBOARDING_SCREENS}`))).toBeVisible();
      if (i < NUM_ONBOARDING_SCREENS) {
        await expect(element(by.text('Next'))).toBeVisible();
        await element(by.text('Next')).tap();
      } else {
        await expect(element(by.text('Done'))).toBeVisible();
      }
    }
  });
});
