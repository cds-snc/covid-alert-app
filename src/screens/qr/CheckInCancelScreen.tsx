import React from 'react';
import {Box, Text} from 'components';
import {useI18n} from 'locale';

import {BaseQRCodeScreen} from './components/BaseQRCodeScreen';

export const CheckInCancelScreen = () => {
  const i18n = useI18n();
  return (
    <BaseQRCodeScreen showCloseButton>
      <Box paddingHorizontal="m" paddingBottom="m">
        <Text variant="bodySubTitle" marginTop="xl">
          {i18n.translate('QRCode.CancelCheckIn.Title')}
        </Text>
      </Box>
      <Box paddingHorizontal="m" paddingTop="m">
        <Text marginBottom="l">{i18n.translate('QRCode.CancelCheckIn.Body')}</Text>
      </Box>
    </BaseQRCodeScreen>
  );
};
