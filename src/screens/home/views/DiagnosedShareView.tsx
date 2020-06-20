import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';
import {Text, Button, Box} from 'components';

import {BaseHomeView} from '../components/BaseHomeView';

export const DiagnosedShareView = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const toSymptomTracker = useCallback(() => {
    Linking.openURL(i18n.translate('Home.SymptomTrackerUrl')).catch(err => console.error('An error occurred', err));
  }, [i18n]);
  const toDataShare = useCallback(() => navigation.navigate('DataSharing'), [navigation]);

  return (
    <BaseHomeView>
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.DailyShare')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.DailyShareDetailed')}
      </Text>
      <Box alignSelf="stretch" marginBottom="s">
        <Button text={i18n.translate('Home.ShareRandomIDsCTA')} variant="bigFlat" onPress={toDataShare} />
      </Box>
      <Box alignSelf="stretch" marginBottom="l">
        <Button
          text={i18n.translate('Home.SignalDataSharedCTA')}
          variant="bigFlat"
          color="bodyText"
          externalLink
          onPress={toSymptomTracker}
        />
      </Box>
    </BaseHomeView>
  );
};
