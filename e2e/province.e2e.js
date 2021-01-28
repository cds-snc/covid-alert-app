/* eslint-disable no-undef */
import {onboard} from './shared';

const changeRegion = async region => {
  // should be called from the home screen
  await element(by.id('tapPromptCollapsed')).tap();
  await element(by.id('getCodeButton')).swipe('up');
  await element(by.id('getCodeButton')).swipe('up');
  await element(by.id('getCodeButton')).swipe('up');
  await element(by.id('getCodeButton')).swipe('up');

  await element(by.id('changeRegion')).tap();
  await waitFor(element(by.id(`RegionPickerSettings-${region}`)))
    .toBeVisible()
    .whileElement(by.id('RegionPickerSettings-ScrollView'))
    .scroll(100, 'down');
  await element(by.id(`RegionPickerSettings-${region}`)).tap();
  await element(by.id('toolbarCloseButton')).tap();

  await element(by.id('getCodeButton')).swipe('down');
  await element(by.id('getCodeButton')).swipe('down');
  await element(by.id('getCodeButton')).swipe('down');
  await element(by.id('getCodeButton')).swipe('down');
  await element(by.id('BottomSheet-Close')).tap();
};

const changeScreen = async screenName => {
  await element(by.id('headerButton')).tap();
  await waitFor(element(by.id(screenName)))
    .toBeVisible()
    .whileElement(by.id('DemoMenu-ScrollView'))
    .scroll(100, 'down');
  await element(by.id(screenName)).tap();
  await element(by.id('toolbarCloseButton')).tap();
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
    if (scroll === 'up') {
      await element(by.id('changeRegion')).swipe('down', 'fast', 1.0);
    } else {
      await element(by.id('changeRegion')).swipe('up', 'fast', 1.0);
    }
    i++;
  }
};

const closeBottomSheet = async () => {
  await scrollBottomSheet('up');
  await element(by.id('BottomSheet-Close')).tap();
};

describe('Test province flow', () => {
  it('lands on the right home screen', async () => {
    await onboard();

    // eslint-disable-next-line jest/no-if
    if (device.getPlatform() === 'ios') {
      await expect(element(by.id('exposureNotificationsDisabled'))).toBeVisible();
      await device.takeScreenshot(`ExposureNotificationsDisabled`);
    } else {
      await expect(element(by.id('frameworkUnavailable'))).toBeVisible();
      await device.takeScreenshot(`FrameworkUnavailable`);
    }
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('displays the right exposure view for ON, AB, NL', async () => {
    await changeScreen('ExposureView');
    await expect(element(by.id('exposure'))).toBeVisible();

    // ON
    await changeRegion('ON');
    await device.takeScreenshot('Exposure-ON-top');
    await element(by.id('exposure')).swipe('up');
    await element(by.id('getCodeButton')).swipe('up');
    await device.takeScreenshot('Exposure-ON-bottom');
    await expect(element(by.id('toDoIfExposed'))).toBeVisible();

    // AB
    await changeRegion('AB');
    await device.takeScreenshot('Exposure-AB-top');
    await element(by.id('exposure')).swipe('up');
    await device.takeScreenshot('Exposure-AB-bottom');
    await expect(element(by.text('Find out if you need to be tested'))).toBeVisible();

    // NL
    await changeRegion('NL');
    await device.takeScreenshot('Exposure-NL-top');
    await element(by.id('exposure')).swipe('up');
    await device.takeScreenshot('Exposure-NL-bottom');
    await expect(element(by.text('Find out if you need to be tested'))).toBeVisible();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('can display the diagnosed view', async () => {
    await changeScreen('DiagnosedShareView');
    await expect(element(by.id('diagnosedShare'))).toBeVisible();
    await device.takeScreenshot('DiagnosedShare');
  });
});

describe('Test region based screens', () => {
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('displays right no code screen for ON, AB, NL', async () => {
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

    // NL
    await changeRegion('NL');
    await element(by.id('tapPromptCollapsed')).tap();
    await scrollBottomSheet('down');
    await element(by.id('getCodeButton')).tap();
    await device.takeScreenshot('noCodeNL');
    await expect(element(by.id('noCodeHeader'))).toBeVisible();
    await expect(element(by.id('noCodeCTA'))).not.toBeVisible();
    await element(by.id('toolbarCloseButton')).tap();
    await closeBottomSheet();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('displays right no exposure screens for no region', async () => {
    await changeRegion('None');
    await changeScreen('NoExposureView');
    await device.takeScreenshot('AllSetViewNoRegion');
    await changeAllSet('true');
    await device.takeScreenshot('NoExposureViewNoRegion');
    await expect(element(by.id('noRegionHeader'))).toBeVisible();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('displays right all set screen for ON, AB, NL', async () => {
    await changeAllSet('false');

    // ON
    await changeRegion('ON');
    await device.takeScreenshot('AllSetViewON');
    await expect(element(by.id('allSetCoveredRegionView'))).toBeVisible();

    // NL
    await changeRegion('NL');
    await device.takeScreenshot('AllSetViewNL');
    await expect(element(by.id('allSetUncoveredRegionView'))).toBeVisible();

    // AB
    await changeRegion('AB');
    await device.takeScreenshot('AllSetViewAB');
    await expect(element(by.id('allSetUncoveredRegionView'))).toBeVisible();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('displays right no exposure screens for ON, AB, NL', async () => {
    // ON
    await changeRegion('ON');
    await changeAllSet('true');
    await device.takeScreenshot('NoExposureViewON');
    await expect(element(by.id('coveredRegionHeader'))).toBeVisible();

    // NL
    await changeRegion('NL');
    await device.takeScreenshot('NoExposureViewNL');
    await expect(element(by.id('uncoveredRegionHeader'))).toBeVisible();

    // AB
    await changeRegion('AB');
    await device.takeScreenshot('NoExposureViewAB');
    await expect(element(by.id('uncoveredRegionHeader'))).toBeVisible();
  });
});
