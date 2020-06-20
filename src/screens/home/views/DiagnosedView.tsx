import React, {useCallback} from 'react';
import {Linking} from 'react-native';
import {useI18n} from '@shopify/react-i18n';
import {Text, Button, Box} from 'components';
import {useExposureStatus} from 'services/ExposureNotificationService';
import {daysBetween} from 'shared/date-fns';
import {pluralizeKey} from 'shared/pluralization';

import {BaseHomeView} from '../components/BaseHomeView';

export const DiagnosedView = () => {
  const [i18n] = useI18n();
  const [exposureStatus] = useExposureStatus();
  const onAction = useCallback(() => {
    Linking.openURL(i18n.translate('Home.SymptomTrackerUrl')).catch(err => console.error('An error occurred', err));
  }, [i18n]);

  if (exposureStatus.type !== 'diagnosed') return null;

  const daysDiff = daysBetween(new Date(), exposureStatus.cycleEndsAt);

  return (
    <BaseHomeView>
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.SignalDataShared')}
        {/* No exposure detected */}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate(pluralizeKey('Home.SignalDataSharedDetailed', daysDiff), {number: daysDiff})}
      </Text>
      <Box alignSelf="stretch" marginBottom="l">
        <Button text={i18n.translate('Home.SignalDataSharedCTA')} variant="bigFlat" externalLink onPress={onAction} />
      </Box>
    </BaseHomeView>
  );
};
