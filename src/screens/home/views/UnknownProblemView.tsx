import {useI18n} from 'locale';
import {Box, ButtonSingleLine, Text} from 'components';
import React, {useCallback} from 'react';
import {captureException} from 'shared/log';
import {Linking} from 'react-native';

import {SystemStatusWrapper} from '../components/BaseHomeView';

export const UnknownProblemView = () => {
  const i18n = useI18n();

  const onHelp = useCallback(() => {
    Linking.openURL(i18n.translate('Info.HelpUrl')).catch(error => captureException('An error occurred', error));
  }, [i18n]);

  return (
    <SystemStatusWrapper iconName="icon-bluetooth-disabled" testID="unknownProblem">
      <Text variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.UnknownProblem.Title')}
      </Text>
      <Text marginBottom="m">{i18n.translate('Home.UnknownProblem.Body')}</Text>
      <Box alignSelf="stretch" marginBottom="m" marginTop="l">
        <ButtonSingleLine
          text={i18n.translate('Home.UnknownProblem.CTA')}
          variant="danger50Flat"
          externalLink
          onPress={onHelp}
        />
      </Box>
    </SystemStatusWrapper>
  );
};
