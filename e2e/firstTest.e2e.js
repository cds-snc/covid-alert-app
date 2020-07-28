describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have landing screen', async () => {
    await expect(element(by.text('English'))).toBeVisible();
  });
});
