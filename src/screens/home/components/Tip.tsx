import React from 'react';
import {Box, ButtonSingleLine, Icon, Text} from 'components';
import {Linking} from 'react-native';
import {useI18n} from 'locale';
import {useStorage} from 'services/StorageService';
import {useRegionalI18n} from 'locale/regional';

export const Tip = () => {
  const i18n = useI18n();
  const regionalI18n = useRegionalI18n();
  const {region} = useStorage();
  const cta = regionalI18n.translate(`RegionContent.DiagnosedView.Active.${region}.Tip.CTA`);
  const url = regionalI18n.translate(`RegionContent.DiagnosedView.Active.${region}.Tip.URL`);

  if (cta === '' || url === '') {
    return null;
  }

  return (
    <Box backgroundColor="green2" borderRadius={10} paddingVertical="m" marginTop="m" marginBottom="m">
      <Box flexDirection="row" paddingLeft="s" paddingRight="m">
        <Box flex={0} paddingTop="xxs" marginRight="xxs">
          <Icon name="icon-light-bulb" size={40} />
        </Box>
        <Box flex={1}>
          <Text>
            <Text fontWeight="bold">{i18n.translate('Home.DiagnosedView.Tip.Title')}</Text>
            <Text>{regionalI18n.translate(`RegionContent.DiagnosedView.Active.${region}.Tip.Body`)}</Text>
          </Text>
        </Box>
      </Box>

      <Box paddingHorizontal="m" paddingTop="s">
        <ButtonSingleLine text={cta} variant="thinFlatNeutralGrey" externalLink onPress={() => Linking.openURL(url)} />
      </Box>
    </Box>
  );
};
