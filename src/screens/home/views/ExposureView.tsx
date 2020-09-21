import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from 'locale';
import {Text, Box, ButtonSingleLine} from 'components';
import {useStorage} from 'services/StorageService';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {isRegionActive} from 'shared/RegionLogic';
import {useRegionalI18n} from 'locale/regional';
import {ExposedHelpButton} from 'components/ExposedHelpButton';

import {BaseHomeView} from '../components/BaseHomeView';

const ActiveContent = ({text}: {text: string}) => {
  if (text === '') {
    return null;
  }
  return <Text marginBottom="m">{text}</Text>;
};

export const ExposureView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const {region} = useStorage();
  const i18n = useI18n();
  const regionalI18n = useRegionalI18n();
  const navigation = useNavigation();
  const regionActive = isRegionActive(region, regionalI18n.activeRegions);
  const onHowToIsolate = useCallback(() => navigation.navigate('HowToIsolate'), [navigation]);
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);
  const activeBodyText = regionalI18n.translate(`RegionContent.ExposureView.Active.${region}.Body`);

  return (
    <BaseHomeView iconName="hand-caution" testID="exposure">
      <Text focusRef={autoFocusRef} variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.ExposureDetected.Title')}
      </Text>
      <Text marginBottom="m">{i18n.translate('Home.ExposureDetected.Body1')}</Text>
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate(`Home.ExposureDetected.Title2`)}
      </Text>
      {regionActive ? (
        <ActiveContent text={activeBodyText} />
      ) : (
        <Text marginBottom="m">
          <Text>{i18n.translate('Home.ExposureDetected.RegionNotCovered.Body2')}</Text>
          <Text fontWeight="bold">{i18n.translate('Home.ExposureDetected.RegionNotCovered.Body3')}</Text>
        </Text>
      )}

      <ExposedHelpButton />

      {!regionActive && (
        <Box alignSelf="stretch" marginBottom="m">
          <ButtonSingleLine
            text={i18n.translate(`Home.ExposureDetected.RegionNotCovered.HowToIsolateCTA`)}
            variant="bigFlatDarkGrey"
            onPress={onHowToIsolate}
            internalLink
          />
        </Box>
      )}
    </BaseHomeView>
  );
};
