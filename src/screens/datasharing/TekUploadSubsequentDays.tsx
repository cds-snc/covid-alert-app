import React from 'react';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {ContagiousDateType} from 'shared/DataSharing';
import {BoldText} from 'shared/BoldText';

import {BaseTekUploadView} from './components';

export const TekUploadSubsequentDays = () => {
  const i18n = useI18n();

  return (
    <BaseTekUploadView
      buttonText={i18n.translate('DataUpload.ConsentView.Action')}
      contagiousDateInfo={{dateType: ContagiousDateType.None, date: null}}
      showBackButton={false}
      closeRoute="Home"
      uploadOtkEntryMetric={false}
    >
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          {i18n.translate('DataUpload.ConsentView.Title')}
        </Text>
        <Text marginBottom="m">{BoldText(i18n.translate('DataUpload.ConsentView.Body1'))}</Text>

        <Text marginBottom="l">{i18n.translate('DataUpload.ConsentView.Body2')}</Text>
      </Box>
    </BaseTekUploadView>
  );
};
