import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

import {BaseDataSharingView} from './components/BaseDataSharingView';

export const IntermediateInstructionScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const onNext = useCallback(() => navigation.navigate('Step2'), [navigation]);

  return (
    <BaseDataSharingView showBackButton={false}>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="l">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.IntermediateStep.Title')}
          </Text>
          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.IntermediateStep.List.1a')}</Text>
            <Text>{i18n.translate('DataUpload.IntermediateStep.List.1b')}</Text>
          </Text>
          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.IntermediateStep.List.2a')}</Text>
            <Text>{i18n.translate('DataUpload.IntermediateStep.List.2b')}</Text>
          </Text>
          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.IntermediateStep.List.3a')}</Text>
            <Text>{i18n.translate('DataUpload.IntermediateStep.List.3b')}</Text>
          </Text>
          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.IntermediateStep.Body1')}</Text>
            <Text>{i18n.translate('DataUpload.IntermediateStep.Body2')}</Text>
          </Text>
          <Box marginTop="m">
            <Button variant="thinFlat" text={i18n.translate('DataUpload.Step0.CTA')} onPress={onNext} />
          </Box>
        </Box>
      </ScrollView>
    </BaseDataSharingView>
  );
};
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
