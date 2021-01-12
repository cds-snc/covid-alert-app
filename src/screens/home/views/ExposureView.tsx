import React from 'react';
import {useI18n} from 'locale';
import {Text, RoundedBox} from 'components';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {isRegionActive} from 'shared/RegionLogic';
import {useStorage} from 'services/StorageService';
import {useRegionalI18n} from 'locale/regional';
import {ExposedHelpButton} from 'components/ExposedHelpButton';

import {BaseHomeView} from '../components/BaseHomeView';

import {ExposureDateView} from './ExposureDateView';
import {NegativeTestButton} from './ClearExposureView';

const ActiveContent = ({text}: {text: string}) => {
  if (text === '') {
    return null;
  }
  return <Text marginBottom="m">{text}</Text>;
};

const ExposureText = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const {region} = useStorage();
  const regionalI18n = useRegionalI18n();
  const regionActive = isRegionActive(region, regionalI18n.activeRegions);
  const i18n = useI18n();
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);
  const activeBodyText = regionalI18n.translate(`RegionContent.ExposureView.Active.${region}.Body`);

  return (
    <>
      <RoundedBox isBoxOne>
        <Text focusRef={autoFocusRef} variant="bodyTitle" marginBottom="m" accessibilityRole="header">
          {i18n.translate('Home.ExposureDetected.Title')}
        </Text>
        <Text marginBottom="m">{i18n.translate('Home.ExposureDetected.Body1')}</Text>
        <ExposureDateView />
      </RoundedBox>

      <RoundedBox isBoxOne={false}>
        <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
          {i18n.translate('Home.ExposureDetected.Title2')}
        </Text>
        {regionActive ? (
          <ActiveContent text={activeBodyText} /> /* pulls from region.json */
        ) : (
          <Text marginBottom="m">{i18n.translate('Home.ExposureDetected.Body2')}</Text>
        )}
        <ExposedHelpButton />
        <NegativeTestButton />
      </RoundedBox>
    </>
  );
};

export const ExposureView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  return (
    <BaseHomeView iconName="hand-caution" testID="exposure">
      <ExposureText isBottomSheetExpanded={isBottomSheetExpanded} />
    </BaseHomeView>
  );
};
