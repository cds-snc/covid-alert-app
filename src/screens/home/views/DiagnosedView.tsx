import React from 'react';
import {useI18n} from '@shopify/react-i18n';
import {Text, Tip} from 'components';
import {useExposureStatus} from 'services/ExposureNotificationService';
import {daysBetween} from 'shared/date-fns';
import {pluralizeKey} from 'shared/pluralization';
import {Linking, TouchableOpacity} from 'react-native';
import {useStorage} from 'services/StorageService';

import {BaseHomeView} from '../components/BaseHomeView';

export const DiagnosedView = () => {
  const [i18n] = useI18n();
  const {region} = useStorage();
  const [exposureStatus] = useExposureStatus();

  if (exposureStatus.type !== 'diagnosed') return null;

  const daysDiff = daysBetween(new Date(), new Date(exposureStatus.cycleEndsAt));

  return (
    <BaseHomeView iconName="hand-wave">
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.DiagnosedView.Title')}
        {/* No exposure detected */}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate(pluralizeKey('Home.DiagnosedView.Body1', daysDiff), {number: daysDiff})}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.DiagnosedView.Body2')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="l">
        {i18n.translate('Home.DiagnosedView.Body3')}
      </Text>
      {region === 'ON' ? (
        <Tip>
          <Text>
            <Text fontWeight="bold">{i18n.translate('Home.DiagnosedView.TipTitle')}</Text>
            <Text>{i18n.translate('Home.DiagnosedView.TipBody')}</Text>
            <Text
              color="linkText"
              variant="linkVariant"
              accessibilityRole="link"
              onPress={() => Linking.openURL(i18n.translate('Home.DiagnosedView.TipURL'))}
            >
              {i18n.translate('Home.DiagnosedView.TipLinkText')}
            </Text>
            <Text>.</Text>
          </Text>
        </Tip>
      ) : null}
    </BaseHomeView>
  );
};
