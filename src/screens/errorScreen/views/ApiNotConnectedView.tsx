import {useI18n} from 'locale';
import {Text, TextMultiline} from 'components';
import React from 'react';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

import {BaseErrorView} from '../components/BaseErrorView';

export const ApiNotConnectedView = () => {
  const i18n = useI18n();

  const autoFocusRef = useAccessibilityAutoFocus(true);
  return (
    <BaseErrorView iconName="icon-bluetooth-disabled">
      <Text focusRef={autoFocusRef} variant="bodyTitle" marginBottom="m" accessibilityRole="header">
        {i18n.translate('Errors.ApiNotConnected.Title')}
      </Text>
      <TextMultiline marginBottom="m" text={i18n.translate('Errors.ApiNotConnected.Body')} />
    </BaseErrorView>
  );
};
