import React from 'react';
import {Text} from 'components';
import {useI18n} from 'locale';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

interface Props {
  enabled: boolean;
  autoFocus?: boolean;
}
export const StatusHeaderView = ({enabled, autoFocus = false}: Props) => {
  const i18n = useI18n();
  const color = enabled ? 'statusSuccess' : 'statusError';
  const autoFocusRef = useAccessibilityAutoFocus();
  return (
    <Text focusRef={autoFocus ? autoFocusRef : null}>
      <Text variant="overlayTitle" color={color}>
        {i18n.translate('OverlayClosed.SystemStatus')}
      </Text>
      <Text variant="overlayTitle" color={color} fontWeight="bold">
        {enabled ? i18n.translate('OverlayClosed.SystemStatusOn') : i18n.translate('OverlayClosed.SystemStatusOff')}
      </Text>
    </Text>
  );
};
