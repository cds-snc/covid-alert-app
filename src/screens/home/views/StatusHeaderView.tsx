import React from 'react';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

interface Props {
  enabled: boolean;
  isBottomSheetExpanded: boolean;
}
export const StatusHeaderView = ({enabled, isBottomSheetExpanded}: Props) => {
  const [i18n] = useI18n();
  const color = enabled ? 'statusSuccess' : 'statusError';
  const autoFocusRef = useAccessibilityAutoFocus(isBottomSheetExpanded);
  return (
    <Box justifyContent="center" flexDirection="row" alignItems="flex-start" paddingHorizontal="m">
      <Text focusRef={autoFocusRef}>
        <Text variant="overlayTitle" color={color}>
          {i18n.translate('OverlayClosed.SystemStatus')}
        </Text>
        <Text variant="overlayTitle" color={color} fontWeight="bold">
          {enabled ? i18n.translate('OverlayClosed.SystemStatusOn') : i18n.translate('OverlayClosed.SystemStatusOff')}
        </Text>
      </Text>
    </Box>
  );
};
