import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';
import {Text, Button, Box} from 'components';

import {BaseHomeView} from '../components/BaseHomeView';

export const DiagnosedShareView = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const toDataShare = useCallback(() => navigation.navigate('DataSharing'), [navigation]);

  return (
    <BaseHomeView iconName="hand-wave">
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.DiagnosedShareView.Title')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.DiagnosedShareView.Body1')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.DiagnosedShareView.Body2')}
      </Text>
      <Box alignSelf="stretch" marginTop="xl" marginBottom="xl">
        <Button text={i18n.translate('Home.DiagnosedShareView.ButtonCTA')} variant="thinFlat" onPress={toDataShare} />
      </Box>
    </BaseHomeView>
  );
};
