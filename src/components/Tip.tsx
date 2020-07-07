import React from 'react';
import {Box, Button, Icon, Text} from 'components';
import {Linking} from 'react-native';
import {useI18n} from '@shopify/react-i18n';

import {ButtonSingleLine} from './ButtonSingleLine';

interface Props {
  children: React.ReactElement;
}

export const Tip = ({children}: Props) => {
  const [i18n] = useI18n();
  return (
    <Box backgroundColor="green2" borderRadius={10} paddingVertical="m" marginTop="m" marginBottom="xl">
      <Box flexDirection="row" paddingLeft="s" paddingRight="m">
        <Box flex={0} paddingTop="xxs" marginRight="xxs">
          <Icon name="icon-light-bulb" size={40} />
        </Box>
        <Box flex={1}>
          <Text fontWeight="bold" accessible>
            {i18n.translate('Home.DiagnosedView.TipTitle')}
          </Text>
          <Text accessible>{i18n.translate('Home.DiagnosedView.TipBody')}</Text>
        </Box>
      </Box>
      <Box paddingHorizontal="m">
        <ButtonSingleLine
          text={i18n.translate('Home.DiagnosedView.TipLinkText')}
          variant="thinFlat"
          externalLink
          onPress={() => Linking.openURL(i18n.translate('Home.DiagnosedView.TipURL'))}
        />
      </Box>
    </Box>
  );
};
