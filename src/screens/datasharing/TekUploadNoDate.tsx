import React, {useCallback} from 'react';
import {Box, Text} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

import {BaseTekUploadView} from './components';

export const TekUploadNoDate = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const secondaryButtonOnPress = useCallback(() => navigation.navigate('Step2'), [navigation]);
  return (
    <BaseTekUploadView
      buttonText={i18n.translate('DataUpload.TekUploadNoDate.CTA')}
      contagiousDateInfo={{dateType: 'noDate', dateString: ''}}
      secondaryButtonText={i18n.translate('DataUpload.TekUploadNoDate.CTA2')}
      secondaryButtonOnPress={secondaryButtonOnPress}
    >
      <Box paddingHorizontal="m">
        <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
          {i18n.translate('DataUpload.TekUploadNoDate.Title')}
        </Text>
      </Box>
    </BaseTekUploadView>
  );
};
