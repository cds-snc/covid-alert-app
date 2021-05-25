import React from 'react';
import {Box, ButtonSingleLine, Icon, Text} from 'components';
import {Linking} from 'react-native';
import {useI18n} from 'locale';
import {useCachedStorage} from 'services/StorageService';
import {useRegionalI18n} from 'locale/regional';

export const Tip = () => {
  const i18n = useI18n();
  const regionalI18n = useRegionalI18n();
  const {region} = useCachedStorage();
  const cta = regionalI18n.translate(`RegionContent.DiagnosedView.Active.${region}.Tip.CTA`);
  const url = regionalI18n.translate(`RegionContent.DiagnosedView.Active.${region}.Tip.URL`);

  if (cta === '' || url === '') {
    return null;
  }

  return (
    <Box>
      <Box flexDirection="row">
        <Box flex={0} paddingTop="xxs" marginRight="xxs">
          <Icon name="icon-light-bulb" size={60} />
        </Box>
        <Box flex={1}>
          <Text>
            <Text fontWeight="bold">{i18n.translate('Home.DiagnosedView.Tip.Title')}</Text>
            <Text>{regionalI18n.translate(`RegionContent.DiagnosedView.Active.${region}.Tip.Body`)}</Text>
          </Text>
        </Box>
      </Box>

      <Box paddingTop="s">
        <ButtonSingleLine text={cta} variant="bigFlatDarkGrey" externalLink onPress={() => Linking.openURL(url)} />
      </Box>
    </Box>
  );
};
