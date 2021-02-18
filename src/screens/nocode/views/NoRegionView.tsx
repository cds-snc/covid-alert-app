import React, {useCallback} from 'react';
import {Box, Text, TextMultiline, ButtonSingleLine} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

export const NoRegionView = () => {
  const i18n = useI18n();
  const navigation = useNavigation();

  const onChooseRegion = useCallback(() => navigation.navigate('RegionSelect'), [navigation]);

  return (
    <Box>
      <Text testID="noCodeHeader" variant="bodyTitle" marginBottom="l" accessibilityRole="header">
        {i18n.translate('DataUpload.NoCode.NoRegion.Title')}
      </Text>
      <TextMultiline marginBottom="l" text={i18n.translate('DataUpload.NoCode.NoRegion.Body')} />
      <ButtonSingleLine
        text={i18n.translate('DataUpload.NoCode.NoRegion.ChooseRegionCTA')}
        variant="bigFlatDarkGrey"
        internalLink
        onPress={onChooseRegion}
      />
    </Box>
  );
};
