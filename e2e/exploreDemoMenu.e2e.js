/* eslint-disable jest/no-if, no-undef */
import {onboard} from './shared';

/**
 * This is a method that returns a promise that waits for the given time period
 * @author Dave S., who took it as best practice from the following https://stackoverflow.com/a/39914235
 * @param {integer} ms Miliseconds to wait
 */
// eslint-disable-next-line promise/param-names
const sleep = ms => new Promise(rs => setTimeout(rs, ms));

/**
 * True if the current device is Apple, false otherwise.
 */
const isDeviceFruity = device.getPlatform() === 'ios';

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "onboard"] }] */
describe('Demo menu test', () => {
  it('onboard', async () => {
    await onboard();
  });

  it('open demo menu', async () => {
    await expect(element(by.id('headerButton'))).toBeVisible();
    await element(by.id('headerButton')).tap();
    await expect(element(by.id('ShowSampleNotification'))).toBeVisible();
    if (isDeviceFruity) await expect(element(by.id('headerButton'))).not.toBeVisible();
    await device.takeScreenshot('DemoMenu');
  });

  /**
   * Array representation of the forcable app view names enum @ForceScreen
   */
  const ForceScreens = Object.values(ForceScreen);

  /**
   * Respective to @ForceScreen - truthy list denoting if the respective view is long enough to
   * warrant being swiped on, to better screenshot it.
   *
   * Ex. 'Exposure' and 'Diagnosed' views currently have lots of text and require swiping down
   *
   * @type {[boolean]}
   */
  const weScroll = new Array(ForceScreens.length).fill(false);
  // scroll on Exposed, not on Android Diagnosed, on Outbreak
  weScroll[2] = true;
  weScroll[4] = isDeviceFruity;
  weScroll[7] = true;

  /**
   * The scroll speed of the ForceScreen swipe.
   */
  const FSspeed = isDeviceFruity ? 'slow' : 'fast';

  /**
   * The scroll acceleration of the ForceScreen swipe.
   */
  const FSacceleration = isDeviceFruity ? 0.41 : 0.31;

  describe('Visits forceable screens', () => {
    ForceScreens.forEach((scr, here) => {
      it(`show ${scr} screen`, async () => {
        await expect(element(by.id('DemoMenu'))).toBeVisible();
        await element(by.id('ClearNotificationReceipts')).swipe('up', FSspeed, FSacceleration);
        await expect(element(by.id(scr))).toBeVisible();
        await element(by.id(scr)).tap();
        await element(by.id('toolbarCloseButton')).tap();
        // We should now be on the expected forced screen
        await device.takeScreenshot(`ForceScreen.${scr}${weScroll[here] ? '-high' : ''}`);
        if (weScroll[here]) {
          await expect(element(by.id('bodyTitle'))).toBeVisible();
          await element(by.id('bodyText')).swipe('up', 'fast');
          await device.takeScreenshot(`ForceScreen.${scr}-low`);
        }
        await expect(element(by.id('headerButton'))).toBeVisible();
        await expect(element(by.id('headerButton'))).toBeVisible();
        await element(by.id('headerButton')).tap();
      });
    });
  });

  describe('Closing Demo menu', () => {
    it('close', async () => {
      if (isDeviceFruity) await expect(element(by.id('headerButton'))).not.toBeVisible();
      await expect(element(by.id('toolbarCloseButton'))).toBeVisible();
      await element(by.id('toolbarCloseButton')).tap();
      // We should now be on the expected forced screen
      await device.takeScreenshot(`ForceScreen.${scr}${weScroll[here] ? '-top' : ''}`);
      if (weScroll[here]) {
        await expect(element(by.id('bodyTitle'))).toBeVisible();
        await element(by.id('bodyText')).swipe('up', 'fast');
        await device.takeScreenshot(`ForceScreen.${scr}-bottom`);
      }
      await expect(element(by.id('headerButton'))).toBeVisible();
      await expect(element(by.id('headerButton'))).toBeVisible();
      await element(by.id('headerButton')).tap();
    });
  });

  it('trigger sample notification', async () => {
    await expect(element(by.id('ShowSampleNotification'))).toBeVisible();
    await element(by.id('ShowSampleNotification')).tap();
    await device.takeScreenshot('SampleNotification');
    // next line waits for notification to fade
    await sleep(7000);
  });

  it('close demo menu', async () => {
    if (isDeviceFruity) await expect(element(by.id('headerButton'))).not.toBeVisible();
    await expect(element(by.id('toolbarCloseButton'))).toBeVisible();
    await element(by.id('toolbarCloseButton')).tap();
    await expect(element(by.id('ShowSampleNotification'))).not.toBeVisible();
    await expect(element(by.id('headerButton'))).toBeVisible();
  });
});
