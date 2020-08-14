/* eslint-disable no-undef */
import {setDemoMode} from './shared';

const changeRegion = async region => {
  // should be called from the home screen
  await element(by.id('tapPromptCollapsed')).tap();
  await element(by.id('changeRegion')).tap();
  await waitFor(element(by.id(`RegionPickerSettings-${region}`)))
    .toBeVisible()
    .whileElement(by.id('RegionPickerSettings-ScrollView'))
    .scroll(100, 'down');
  await element(by.id(`RegionPickerSettings-${region}`)).tap();
  await element(by.id('toolbarCloseButton')).tap();
  await element(by.id('BottomSheet-Close')).tap();
};

const changeScreen = async screenName => {
  await element(by.id('headerButton')).tap();
  await waitFor(element(by.id(screenName)))
    .toBeVisible()
    .whileElement(by.id('DemoMenu-ScrollView'))
    .scroll(100, 'down');
  await element(by.id(screenName)).tap();
  await element(by.id(screenName)).swipe('right');
};

const changeAllSet = async value => {
  await element(by.id('headerButton')).tap();
  await waitFor(element(by.id(`allSetToggle-${value}`)))
    .toBeVisible()
    .whileElement(by.id('DemoMenu-ScrollView'))
    .scroll(100, 'down');
  await element(by.id(`allSetToggle-${value}`)).tap();
  await element(by.id(`allSetToggle-${value}`)).swipe('right');
};

// The number of swipes needed to get to the top/bottom of the bottom sheet
const BOTTOM_SHEET_SWIPE_COUNT = 5;
/**
 * Scroll through the BottomSheet (Only for Android)
 * @param {string} scroll - direction to scroll: up/down
 */
const scrollBottomSheet = async scroll => {
  if (device.getPlatform() === 'ios') return;
  let i = 0;
  while (i < BOTTOM_SHEET_SWIPE_COUNT) {
    scroll === 'up'
      ? await element(by.id('changeRegion')).swipe('down', 'fast', 1.0)
      : await element(by.id('changeRegion')).swipe('up', 'fast', 1.0);
    i++;
  }
};

const closeBottomSheet = async () => {
  await scrollBottomSheet('up');
  await element(by.id('BottomSheet-Close')).tap();
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

describe('Test region based screens', () => {
  it('displays right no code screen for ON and AB', async () => {
    // ON
    await changeRegion('ON');
    await element(by.id('tapPromptCollapsed')).tap();
    await scrollBottomSheet('down');
    await element(by.id('getCodeButton')).tap();
    await device.takeScreenshot('noCodeON');
    await expect(element(by.id('noCodeHeader'))).toBeVisible();
    await expect(element(by.id('noCodeCTA'))).toBeVisible();
    await element(by.id('toolbarCloseButton')).tap();
    await closeBottomSheet();

    // AB
    await changeRegion('AB');
    await element(by.id('tapPromptCollapsed')).tap();
    await scrollBottomSheet('down');
    await element(by.id('getCodeButton')).tap();
    await device.takeScreenshot('noCodeAB');
    await expect(element(by.id('noCodeHeader'))).toBeVisible();
    await expect(element(by.id('noCodeCTA'))).not.toBeVisible();
    await element(by.id('toolbarCloseButton')).tap();
    await closeBottomSheet();
  });

  it('displays right no exposure screens for no region', async () => {
    await changeRegion('None');
    await changeScreen('NoExposureView');
    await device.takeScreenshot('AllSetViewNoRegion');
    await changeAllSet('true');
    await device.takeScreenshot('NoExposureViewNoRegion');
    await expect(element(by.id('noRegionHeader'))).toBeVisible();
  });

  it('displays right all set screen for ON and AB', async () => {
    await changeAllSet('false');

    // ON
    await changeRegion('ON');
    await device.takeScreenshot('AllSetViewON');
    await expect(element(by.id('allSetCoveredRegionView'))).toBeVisible();

    // AB
    await changeRegion('AB');
    await device.takeScreenshot('AllSetViewAB');
    await expect(element(by.id('allSetUncoveredRegionView'))).toBeVisible();
  });

  it('displays right no exposure screens for ON and AB', async () => {
    // ON
    await changeRegion('ON');
    await changeAllSet('true');
    await device.takeScreenshot('NoExposureViewON');
    await expect(element(by.id('coveredRegionHeader'))).toBeVisible();

    // AB
    await changeRegion('AB');
    await device.takeScreenshot('NoExposureViewAB');
    await expect(element(by.id('uncoveredRegionHeader'))).toBeVisible();
  });
});
