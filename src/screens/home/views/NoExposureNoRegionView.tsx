import React, {useCallback} from 'react';
import {Text, Box, ButtonMultiline, LastCheckedDisplay} from 'components';
import {useNavigation} from '@react-navigation/native';
import {useI18n} from '@shopify/react-i18n';

import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureNoRegionView = () => {
  const [i18n] = useI18n();
  const navigation = useNavigation();
  const onDiagnosed = useCallback(() => navigation.navigate('DataSharing'), [navigation]);

  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView>
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected.NoRegion.Title')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.NoExposureDetected.NoRegion.Body')}
      </Text>
      <LastCheckedDisplay textDark />

      <Box alignSelf="stretch" marginTop="m" marginBottom="l">
        <ButtonMultiline
          text={i18n.translate('Home.NoExposureDetected.NoRegion.DiagnosedBtnText1')}
          text1={i18n.translate('Home.NoExposureDetected.NoRegion.DiagnosedBtnText2')}
          variant="bigFlat"
          internalLink
          onPress={onDiagnosed}
        />
      </Box>
    </BaseHomeView>
  );
};
