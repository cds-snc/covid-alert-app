import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Linking} from 'react-native';
import {useI18n} from 'locale';
import {Text, Box, ButtonSingleLine} from 'components';
import {useStorage} from 'services/StorageService';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

import {BaseHomeView} from '../components/BaseHomeView';

export const ExposureView = ({isBottomSheetExpanded}: {isBottomSheetExpanded: boolean}) => {
  const {region} = useStorage();
  const i18n = useI18n();
  const navigation = useNavigation();
  const getGuidanceURL = useCallback(() => {
    if (region !== undefined && region !== 'None') {
      return i18n.translate(`RegionalGuidance.${region}.URL`);
    }
    return i18n.translate(`RegionalGuidance.CA.URL`);
  }, [i18n, region]);

  const getGuidanceCTA = useCallback(() => {
    if (region !== undefined && region !== 'None') {
      return i18n.translate(`RegionalGuidance.${region}.CTA`);
    }
    return i18n.translate(`RegionalGuidance.CA.CTA`);
  }, [i18n, region]);

  const onActionGuidance = useCallback(() => {
    Linking.openURL(getGuidanceURL()).catch(err => console.error('An error occurred', err));
  }, [getGuidanceURL]);
  const onHowToIsolate = useCallback(() => navigation.navigate('HowToIsolate'), [navigation]);
  const autoFocusRef = useAccessibilityAutoFocus(!isBottomSheetExpanded);
  const isRegionOntario = region === 'ON';

  const getRegionForText = useCallback(() => {
    if (isRegionOntario) {
      return region;
    }
    // default to CA for all other regions that are not yet supported
    return 'CA';
  }, [region]);

  return (
    <BaseHomeView iconName="hand-caution">
      <Text focusRef={autoFocusRef} variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate(`Home.ExposureDetected.${getRegionForText()}.Title`)}
      </Text>
      <Text marginBottom="m">{i18n.translate(`Home.ExposureDetected.${getRegionForText()}.Body1`)}</Text>
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate(`Home.ExposureDetected.${getRegionForText()}.Title2`)}
      </Text>
      <Text>
        <Text>{i18n.translate(`Home.ExposureDetected.${getRegionForText()}.Body2`)}</Text>
        {!isRegionOntario && (
          <Text fontWeight="bold">{i18n.translate(`Home.ExposureDetected.${getRegionForText()}.Body3`)}</Text>
        )}
      </Text>

      <Box alignSelf="stretch" marginTop="l" marginBottom={isRegionOntario ? 'xxl' : 'm'}>
        <ButtonSingleLine text={getGuidanceCTA()} variant="bigFlatPurple" externalLink onPress={onActionGuidance} />
      </Box>
      {!isRegionOntario && (
        <Box alignSelf="stretch" marginBottom="xl">
          <ButtonSingleLine
            text={i18n.translate(`Home.ExposureDetected.${getRegionForText()}.HowToIsolateCTA`)}
            variant="bigFlatDarkGrey"
            onPress={onHowToIsolate}
            internalLink
          />
        </Box>
      )}
    </BaseHomeView>
  );
};
