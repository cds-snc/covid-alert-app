import React, {useCallback} from 'react';
import {Box, ButtonSingleLine, ErrorBox} from 'components';
import {getExposedHelpURL, isRegionActive} from 'shared/RegionLogic';
import {useRegionalI18n} from 'locale/regional';
import {useCachedStorage} from 'services/StorageService';
import {Linking} from 'react-native';
import {captureException} from 'shared/log';
import {useNavigation} from '@react-navigation/native';

export const ExposedHelpButton = () => {
  const {region} = useCachedStorage();
  const regionalI18n = useRegionalI18n();
  const navigation = useNavigation();

  const regionActive = isRegionActive(region, regionalI18n.activeRegions);

  const getCTA = useCallback(() => {
    if (region !== undefined && region !== 'None') {
      return regionActive
        ? regionalI18n.translate(`RegionContent.ExposureView.Active.${region}.CTA`)
        : regionalI18n.translate(`RegionContent.ExposureView.Inactive.${region}.CTA`);
    }
    return regionalI18n.translate(`RegionContent.ExposureView.Inactive.CA.CTA`);
  }, [region, regionActive, regionalI18n]);

  const cta = getCTA();
  const onPress = useCallback(() => {
    if (region !== undefined && region !== 'None') {
      Linking.openURL(getExposedHelpURL(region, regionalI18n)).catch(error =>
        captureException('An error occurred', error),
      );
    } else {
      navigation.navigate('RegionSelectExposedNoPT');
    }
  }, [region, regionalI18n, navigation]);

  if (cta === '') {
    return <ErrorBox marginTop="m" />;
  }
  return (
    <Box alignSelf="stretch" marginTop="s" marginBottom={regionActive ? 'm' : 'm'}>
      {region !== undefined && region !== 'None' ? (
        <ButtonSingleLine text={cta} variant="bigFlatPurple" externalLink onPress={onPress} />
      ) : (
        <ButtonSingleLine text={cta} variant="bigFlatPurple" internalLinkLight onPress={onPress} />
      )}
    </Box>
  );
};
