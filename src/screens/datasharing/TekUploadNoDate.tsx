import React from 'react';
import {Box, Text} from 'components';
import {useI18n} from 'locale';

import {BaseTekUploadView} from './components';

export const TekUploadNoDate = () => {
  const i18n = useI18n();

  return (
    <BaseTekUploadView
      buttonText={i18n.translate('DataUpload.TekUploadNoDate.CTA')}
      contagiousDateInfo={{dateType: 'noDate', dateString: ''}}
    >
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          {i18n.translate('DataUpload.TekUploadNoDate.Title')}
        </Text>
      </Box>
    </BaseTekUploadView>
  );
};
