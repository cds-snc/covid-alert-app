import React, {useCallback} from 'react';
import {Text, Button, Box, LastCheckedDisplay} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';
import {useStorage} from 'services/StorageService';
import {Region} from 'shared/Region';
import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureView = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const {region} = useStorage();
  const onRegion = useCallback(() => navigation.navigate('RegionSelect'), [navigation]);

  const isRegionCovered = (region: Region) => {
    const onboardedCovered = ['ON'];
    if (onboardedCovered.indexOf(region) > -1) {
      return true;
    }
    return false;
  };

  let regionCase = 'regionNotCovered';
  if (!region) {
    regionCase = 'noRegionSet';
  } else if (isRegionCovered(region)) {
    regionCase = 'regionCovered';
  }

  const regionTranslations = {
    noRegionSet: 'Home.NoExposureDetected.NoRegionSet',
    regionCovered: 'Home.NoExposureDetected.RegionCovered',
    regionNotCovered: 'Home.NoExposureDetected.RegionNotCovered',
  };

  return (
    <BaseHomeView animationSource={require('assets/animation/blue-dot.json')}>
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" textAlign="center" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected')}
      </Text>
      <Text variant="bodyText" color="bodyText" textAlign="center">
        {i18n.translate(regionTranslations[regionCase])}
      </Text>
      <LastCheckedDisplay />
      {regionCase == 'noRegionSet' ? (
        <Box alignSelf="stretch" marginTop="l">
          <Button text={i18n.translate('Home.ChooseRegion')} variant="bigFlat" onPress={onRegion} />
        </Box>
      ) : (
        <Box height={50} />
      )}
    </BaseHomeView>
  );
};
