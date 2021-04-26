import {useI18n} from 'locale';
import {Box, ButtonSingleLine, Text} from 'components';
import React, {useCallback} from 'react';
import {captureException} from 'shared/log';
import {Linking} from 'react-native';

import {BaseHomeView} from '../components/BaseHomeView';
import {HomeScreenTitle} from '../components/HomeScreenTitle';

export const UnknownProblemView = () => {
  const i18n = useI18n();

  const onHelp = useCallback(() => {
    Linking.openURL(i18n.translate('Info.HelpUrl')).catch(error => captureException('An error occurred', error));
  }, [i18n]);

  return (
    <BaseHomeView iconName="icon-bluetooth-disabled" testID="unknownProblem">
      <HomeScreenTitle>{i18n.translate('Home.UnknownProblem.Title')}</HomeScreenTitle>
      <Text marginBottom="m">{i18n.translate('Home.UnknownProblem.Body')}</Text>
      <Box alignSelf="stretch" marginBottom="m" marginTop="l">
        <ButtonSingleLine
          text={i18n.translate('Home.UnknownProblem.CTA')}
          variant="danger50Flat"
          externalLink
          onPress={onHelp}
        />
      </Box>
    </BaseHomeView>
  );
};
