import React from 'react';
import {Box, Text} from 'components';
import {useI18n} from '@shopify/react-i18n';

interface Props {
  enabled: boolean;
}
export const StatusHeaderView = ({enabled}: Props) => {
  const [i18n] = useI18n();
  const color = enabled ? 'statusSuccess' : 'statusError';
  return (
    <Box justifyContent="center" flexDirection="row" alignItems="flex-start" paddingHorizontal="m">
      <Box paddingTop="xs" flexDirection="row" flexWrap="wrap">
        <Text variant="overlayTitle" lineHeight={19} color={color}>
          {i18n.translate('OverlayClosed.SystemStatus')}
        </Text>
        <Text variant="overlayTitle" lineHeight={19} color={color} fontFamily="Noto Sans" fontWeight="bold">
          {enabled ? i18n.translate('OverlayClosed.SystemStatusOn') : i18n.translate('OverlayClosed.SystemStatusOff')}
        </Text>
      </Box>
    </Box>
  );
};
