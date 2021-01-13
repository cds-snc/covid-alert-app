import React from 'react';
import {Text, TextMultiline, RoundedBox} from 'components';
import {useI18n} from 'locale';
import {Platform} from 'react-native';

export const WhatsNew = () => {
  const i18n = useI18n();

  return Platform.OS === 'ios' ? null : (
    <RoundedBox isBoxOne={false}>
      <Text variant="bodySubTitle" color="bodyText" marginBottom="m" accessibilityRole="header" accessibilityAutoFocus>
        {i18n.translate('Home.NoExposureDetected.WhatsNew.Title')}
      </Text>

      <TextMultiline
        variant="bodyText"
        color="bodyText"
        marginBottom="m"
        text={i18n.translate('Home.NoExposureDetected.WhatsNew.Body1')}
      />

      <TextMultiline
        variant="bodyText"
        color="bodyText"
        marginBottom="m"
        text={i18n.translate('Home.NoExposureDetected.WhatsNew.Body2')}
      />
    </RoundedBox>
  );
};
