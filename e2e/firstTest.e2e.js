/* eslint-disable no-undef */
describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('has landing screen', async () => {
    await expect(element(by.text('English'))).toBeVisible();
  });
});
