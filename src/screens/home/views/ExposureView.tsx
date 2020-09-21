import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Linking} from 'react-native';
import {useI18n} from 'locale';
import {Text, Box, ButtonSingleLine, ErrorBox} from 'components';
import {useStorage} from 'services/StorageService';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';
import {captureException} from 'shared/log';
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
  const getGuidanceURL = useCallback(() => {
    if (region !== undefined && region !== 'None') {
      console.log('regiona', region);
      return regionActive
        ? regionalI18n.translate(`RegionContent.ExposureView.Active.${region}.URL`)
        : regionalI18n.translate(`RegionContent.ExposureView.Inactive.${region}.URL`);
    }
    console.log('regionb', region);
    return regionalI18n.translate(`RegionContent.ExposureView.Inactive.CA.URL`);
  }, [region, regionActive, regionalI18n]);

  const getGuidanceCTA = useCallback(() => {
    if (region !== undefined && region !== 'None') {
      return regionActive
        ? regionalI18n.translate(`RegionContent.ExposureView.Active.${region}.CTA`)
        : regionalI18n.translate(`RegionContent.ExposureView.Inactive.${region}.CTA`);
    }
    return regionalI18n.translate(`RegionContent.ExposureView.Inactive.CA.CTA`);
  }, [region, regionActive, regionalI18n]);

  const regionalGuidanceCTA = getGuidanceCTA();

  const onActionGuidance = useCallback(() => {
    console.log('getGuidanceURL', getGuidanceURL());
    Linking.openURL(getGuidanceURL()).catch(error => captureException('An error occurred', error));
  }, [getGuidanceURL]);
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
