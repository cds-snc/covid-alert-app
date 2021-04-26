/* eslint-disable no-undef */
import {onboard} from './shared';

describe('Test one time code flow', () => {
  it('can get to the one time code screen', async () => {
    await onboard();
    await element(by.id('tapPromptCollapsed')).tap();
    await device.takeScreenshot('BottomSheet');
    await element(by.text('Enter your one-time key')).tap();
    await device.takeScreenshot('OTC-Step1');

    await element(by.id('Step0Body')).swipe('up');
    await element(by.id('Step0Body')).swipe('up');

    if (device.getPlatform() === 'ios') {
      // no idea why iOS needs an additional tap
      await element(by.text('Next')).tap();
    }
    await element(by.text('Next')).tap();

    await device.takeScreenshot('OTC-Step2');

    await element(by.id('textInput')).tap();
    await device.takeScreenshot('OTC-Step2-focussed');

    await element(by.id('textInput')).typeText('ABC123ABCD');
    await element(by.id('pageTitle')).tap();

    await element(by.id('submitTEKButton')).tap();
    await device.takeScreenshot('OTC-Step2-error');

    await expect(element(by.text('OK'))).toBeVisible();
  });
});
