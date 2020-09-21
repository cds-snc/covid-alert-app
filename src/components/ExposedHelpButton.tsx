import React, {useCallback} from 'react';
import {Box, ButtonSingleLine, ErrorBox} from 'components';
import {isRegionActive} from 'shared/RegionLogic';
import {useRegionalI18n} from 'locale/regional';
import {useStorage} from 'services/StorageService';
import {Linking} from 'react-native';
import {captureException} from 'shared/log';
import {Region} from 'shared/Region';

export function getExposedHelpURL(region: Region | undefined, regionActive: boolean, regionalI18n: any) {
  const nationalURL = regionalI18n.translate(`RegionContent.ExposureView.Inactive.CA.URL`);
  if (region !== undefined && region !== 'None') {
    const regionalURL = regionActive
      ? regionalI18n.translate(`RegionContent.ExposureView.Active.${region}.URL`)
      : regionalI18n.translate(`RegionContent.ExposureView.Inactive.${region}.URL`);
    if (regionalURL === '') {
      return nationalURL;
    }
    return regionalURL;
  }
  return nationalURL;
}

export const ExposedHelpButton = () => {
  const {region} = useStorage();
  const regionalI18n = useRegionalI18n();

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
    Linking.openURL(getExposedHelpURL(region, regionActive, regionalI18n)).catch(error =>
      captureException('An error occurred', error),
    );
  }, [region, regionActive, regionalI18n]);

  if (cta === '') {
    return <ErrorBox marginTop="m" />;
  }
  return (
    <Box alignSelf="stretch" marginTop="s" marginBottom={regionActive ? 'xxl' : 'm'}>
      <ButtonSingleLine text={cta} variant="bigFlatPurple" externalLink onPress={onPress} />
    </Box>
  );
};
