import React from 'react';
import {Box, Text, TextMultiline} from 'components';
import {useI18n} from 'locale';
import {ContagiousDateType} from 'shared/DataSharing';

import {BaseTekUploadView, StepXofY} from './components';

export const TekUploadNoDate = () => {
  const i18n = useI18n();
  return (
    <BaseTekUploadView
      buttonText={i18n.translate('DataUpload.TekUploadNoDate.CTA')}
      contagiousDateInfo={{dateType: ContagiousDateType.None, dateString: ''}}
    >
      <Box paddingHorizontal="m">
        <StepXofY currentStep={3} />
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          {i18n.translate('DataUpload.TekUploadNoDate.Title')}
        </Text>
        <TextMultiline marginBottom="l" text={i18n.translate('DataUpload.TekUploadNoDate.Body')} />
      </Box>
    </BaseTekUploadView>
  );
};
