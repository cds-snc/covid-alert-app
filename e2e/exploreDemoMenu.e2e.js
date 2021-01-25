/* eslint-disable no-undef */
import {onboard} from './shared';

/**
 * This is a method that returns a promise that waits for the given time period
 * @author Dave
 * @param {integer} ms Miliseconds to wait
 */
// eslint-disable-next-line promise/param-names
const sleep = ms => new Promise(rs => setTimeout(rs, ms));

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "onboard"] }] */
describe('Demo menu test', () => {
  it('onboard', async () => {
    await onboard();
  });
  it('open demo menu', async () => {
    await expect(element(by.id('headerButton'))).toBeVisible();
    await element(by.id('headerButton')).tap();
    await expect(element(by.id('ShowSampleNotification'))).toBeVisible();
    await expect(element(by.id('headerButton'))).not.toBeVisible();
    await device.takeScreenshot('DemoMenu');
  });

  it('trigger sample notification', async () => {
    await expect(element(by.id('ShowSampleNotification'))).toBeVisible();
    await element(by.id('ShowSampleNotification')).tap();
    await device.takeScreenshot('SampleNotification');
    // next line waits for notif to go away
    await sleep(9000);
  });

  /**
   * List of app view names
   *
   * @typedef screenData const in TestScreen.tsx, line 33
   * @type {[String]}
   */
  const screens = [
    'None',
    'NoExposureView',
    'ExposureView',
    'DiagnosedShareView',
    'DiagnosedView',
    'DiagnosedShareUploadView',
    'FrameworkUnavailableView',
  ];

  /**
   * Respective to @screens - truthy list denoting if the respective view is long enough to
   * warrant being swiped on, to better screenshot it.
   *
   * Ex. 'Exposure' and 'Diagnosed' views currently have lots of text and required swiping
   *
   * @type {[boolean]}
   */
  const weScroll = [0, 0, 1, 0, 1, 0, 0];

  screens.forEach((scr, here) => {
    it(`force ${scr} screen`, async () => {
      await expect(element(by.id('ForceScreens'))).toBeVisible();
      await element(by.id('ForceScreens')).swipe('up', 'slow', 0.2);
      await expect(element(by.id(scr))).toBeVisible();
      await element(by.id(scr)).tap();
      await element(by.id('toolbarCloseButton')).tap();
      // We should now be on the expected forced screen
      await device.takeScreenshot(`ForceScreen.${scr}${weScroll[here] ? '-top' : ''}`);
      // eslint-disable-next-line jest/no-if
      if (weScroll[here]) {
        await expect(element(by.id('bodyTitle'))).toBeVisible();
        await element(by.id('bodyText')).swipe('up', 'fast');
        await element(by.id('bodyText')).swipe('up', 'fast');
        await device.takeScreenshot(`ForceScreen.${scr}-bottom`);
      }
      await expect(element(by.id('headerButton'))).toBeVisible();
      await expect(element(by.id('headerButton'))).toBeVisible();
      await element(by.id('headerButton')).tap();
    });
  });

  it('close demo menu', async () => {
    await expect(element(by.id('headerButton'))).not.toBeVisible();
    await expect(element(by.id('toolbarCloseButton'))).toBeVisible();
    await element(by.id('toolbarCloseButton')).tap();
    await expect(element(by.id('ShowSampleNotification'))).not.toBeVisible();
    await expect(element(by.id('headerButton'))).toBeVisible();
  });
});
