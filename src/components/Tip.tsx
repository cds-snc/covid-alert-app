import React from 'react';
import {Box, Button, Icon, Text} from 'components';
import {Linking} from 'react-native';
import {useI18n} from '@shopify/react-i18n';

interface Props {
  children: React.ReactElement;
}

export const Tip = ({children}: Props) => {
  const [i18n] = useI18n();
  return (
    <Box
      backgroundColor="green2"
      borderRadius={10}
      paddingVertical="m"
      paddingLeft="s"
      paddingRight="m"
      flexDirection="row"
      marginTop="m"
      marginBottom="xl"
    >
      <Box flex={0} paddingTop="xxs" marginRight="xxs">
        <Icon name="icon-light-bulb" size={40} />
      </Box>
      <Box flex={1}>
        <Text fontWeight="bold" accessible>
          {i18n.translate('Home.DiagnosedView.TipTitle')}
        </Text>
        <Text accessible>{i18n.translate('Home.DiagnosedView.TipBody')}</Text>
        <Button
          variant="subduedText"
          text={i18n.translate('Home.DiagnosedView.TipLinkText')}
          onPress={() => Linking.openURL(i18n.translate('Home.DiagnosedView.TipURL'))}
        />
      </Box>
    </Box>
  );
};
