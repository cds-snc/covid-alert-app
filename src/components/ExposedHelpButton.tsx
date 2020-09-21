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
  const getGuidanceURL = useCallback(() => {
    if (region !== undefined && region !== 'None') {
      return regionActive
        ? regionalI18n.translate(`RegionContent.ExposureView.Active.${region}.URL`)
        : regionalI18n.translate(`RegionContent.ExposureView.Inactive.${region}.URL`);
    }
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
    Linking.openURL(getGuidanceURL()).catch(error => captureException('An error occurred', error));
  }, [getGuidanceURL]);

  if (regionalGuidanceCTA === '') {
    return <ErrorBox marginTop="m" />;
  }
  if (inMenu) {
    return (
      <InfoShareItem
        onPress={onActionGuidance}
        text={i18n.translate('Home.ExposedHelpCTA')}
        icon="icon-external-arrow"
        accessibilityRole="link"
        accessibilityHint={`${regionalGuidanceCTA} . ${i18n.translate('Home.ExternalLinkHint')}`}
      />
    );
  }
  return (
    <Box alignSelf="stretch" marginTop="s" marginBottom={regionActive ? 'xxl' : 'm'}>
      <ButtonSingleLine text={regionalGuidanceCTA} variant="bigFlatPurple" externalLink onPress={onActionGuidance} />
    </Box>
  );
};
