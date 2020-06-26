import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';
import {Text, ButtonSingleLine, Box} from 'components';

import {BaseHomeView} from '../components/BaseHomeView';

export const DiagnosedShareView = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const toDataShare = useCallback(() => navigation.navigate('DataSharing'), [navigation]);

  return (
    <BaseHomeView iconName="hand-wave">
      <Text variant="bodyTitle" color="bodyText" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Home.DailyShare')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.DailyShareDetailed')}
      </Text>
      <Box alignSelf="stretch" marginTop="xxl" marginBottom="xl">
        <ButtonSingleLine
          text={i18n.translate('Home.ShareRandomIDsCTA')}
          variant="bigFlatPurple"
          externalLink
          onPress={toDataShare}
        />
      </Box>
    </BaseHomeView>
  );
};
