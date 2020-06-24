import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, Box, ButtonMultiline, LastCheckedDisplay} from 'components';
import {useI18n} from '@shopify/react-i18n';

import {BaseHomeView} from '../components/BaseHomeView';

export const NoExposureCoveredRegionView = () => {
  const [i18n] = useI18n();

  const navigation = useNavigation();

  const onDiagnosed = useCallback(() => navigation.navigate('DataSharing'), [navigation]);

  return (
    // note you can add an icon i.e. <BaseHomeView iconName="icon-offline>
    <BaseHomeView iconName="thumbs-up">
      <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
        {i18n.translate('Home.NoExposureDetected.RegionCovered.Title')}
      </Text>
      <Text variant="bodyText" color="bodyText" marginBottom="m">
        {i18n.translate('Home.NoExposureDetected.RegionCovered.Body')}
      </Text>

      <LastCheckedDisplay textDark />

      <Box alignSelf="stretch" marginTop="m" marginBottom="l">
        <ButtonMultiline
          text={i18n.translate('Home.NoExposureDetected.RegionCovered.DiagnosedBtnText1')}
          text1={i18n.translate('Home.NoExposureDetected.RegionCovered.DiagnosedBtnText2')}
          variant="bigFlat"
          internalLink
          onPress={onDiagnosed}
        />
      </Box>
    </BaseHomeView>
  );
};
