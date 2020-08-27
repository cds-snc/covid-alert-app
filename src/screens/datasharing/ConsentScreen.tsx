import React from 'react';
import {Box, Text} from 'components';
import {useI18n} from 'locale';

import {BaseTekUploadView} from './components/BaseTekUploadView';

export const ConsentScreen = () => {
  const i18n = useI18n();

  return (
    <BaseTekUploadView buttonText={i18n.translate('DataUpload.ConsentView.Action')}>
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          {i18n.translate('DataUpload.ConsentView.Title')}
        </Text>
        <Text marginBottom="m">{i18n.translate('DataUpload.ConsentView.Body1')}</Text>
        <Text marginBottom="m">
          <Text fontWeight="bold">{i18n.translate('DataUpload.ConsentView.Body2a')}</Text>
          <Text>{i18n.translate('DataUpload.ConsentView.Body2b')}</Text>
        </Text>
        <Text marginBottom="l">{i18n.translate('DataUpload.ConsentView.Body3')}</Text>
      </Box>
    </BaseTekUploadView>
  );
};
