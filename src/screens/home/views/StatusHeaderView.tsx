import React from 'react';
import {Box, Text} from 'components';
import {useI18n} from 'locale';

interface Props {
  enabled: boolean;
}
export const StatusHeaderView = ({enabled}: Props) => {
  const i18n = useI18n();
  const color = enabled ? 'statusSuccess' : 'statusError';
  return (
    <Box justifyContent="center" flexDirection="row" alignItems="flex-start" paddingHorizontal="m">
      <Text>
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
