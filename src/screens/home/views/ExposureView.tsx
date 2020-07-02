import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {useI18n} from '@shopify/react-i18n';
import {Text, Box, ButtonSingleLine} from 'components';
import {useStorage} from 'services/StorageService';

import {BaseHomeView} from '../components/BaseHomeView';

export const ExposureView = () => {
  const {region} = useStorage();
  const [i18n] = useI18n();
  const onActionGuidance = useCallback(() => {
    let url = i18n.translate(`RegionalGuidanceURL.CA`);
    if (region !== undefined && region !== 'None') {
      const regionalURL = i18n.translate(`RegionalGuidanceURL.${region}`);
      if (regionalURL !== '') {
        url = regionalURL;
      }
    }
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }, [i18n, region]);

  return (
    <BaseHomeView iconName="hand-caution">
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.ExposureDetected.Title')}
      </Text>
      <Text marginBottom="m">{i18n.translate('Home.ExposureDetected.Body1')}</Text>
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.ExposureDetected.Title2')}
      </Text>
      <Text>{i18n.translate('Home.ExposureDetected.Body2')}</Text>

      {/* <LastCheckedDisplay /> */}
      <Box alignSelf="stretch" marginTop="xxl" marginBottom="xl">
        <ButtonSingleLine
          text={i18n.translate('Home.SeeGuidance')}
          variant="bigFlatPurple"
          externalLink
          onPress={onActionGuidance}
        />
      </Box>
    </BaseHomeView>
  );
};
