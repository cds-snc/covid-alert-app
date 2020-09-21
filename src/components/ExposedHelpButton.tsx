import React, {useCallback} from 'react';
import {Box, ButtonSingleLine, ErrorBox, InfoShareItem} from 'components';
import {isRegionActive} from 'shared/RegionLogic';
import {useI18n} from 'locale';
import {useRegionalI18n} from 'locale/regional';
import {useStorage} from 'services/StorageService';
import {Linking} from 'react-native';
import {captureException} from 'shared/log';

export const ExposedHelpButton = ({inMenu = false}: {inMenu?: boolean}) => {
  const {region} = useStorage();
  const regionalI18n = useRegionalI18n();
  const i18n = useI18n();

  const regionActive = isRegionActive(region, regionalI18n.activeRegions);
  const getURL = useCallback(() => {
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
  }, [region, regionActive, regionalI18n]);

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
    Linking.openURL(getURL()).catch(error => captureException('An error occurred', error));
  }, [getURL]);

  if (inMenu) {
    return (
      <InfoShareItem
        onPress={onPress}
        text={i18n.translate('Home.ExposedHelpCTA')}
        icon="icon-external-arrow"
        accessibilityRole="link"
        accessibilityHint={`${cta} . ${i18n.translate('Home.ExternalLinkHint')}`}
      />
    );
  }
  if (cta === '') {
    return <ErrorBox marginTop="m" />;
  }
  return (
    <Box alignSelf="stretch" marginTop="s" marginBottom={regionActive ? 'xxl' : 'm'}>
      <ButtonSingleLine text={cta} variant="bigFlatPurple" externalLink onPress={onPress} />
    </Box>
  );
};
