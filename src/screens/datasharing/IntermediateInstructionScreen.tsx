import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {BoldText} from 'shared/BoldText';

import {BaseDataSharingView} from './components/BaseDataSharingView';

export const IntermediateInstructionScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const onNext = useCallback(() => navigation.navigate('Step2'), [navigation]);

  return (
    <BaseDataSharingView showBackButton={false} closeRoute="Home">
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="l">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.IntermediateStep.Title')}
          </Text>

          <Text marginBottom="l">{BoldText(i18n.translate('DataUpload.IntermediateStep.List.1'))}</Text>

          <Text marginBottom="l">{BoldText(i18n.translate('DataUpload.IntermediateStep.List.2'))}</Text>

          <Text marginBottom="l">{BoldText(i18n.translate('DataUpload.IntermediateStep.List.3'))}</Text>

          <Text marginBottom="l">{BoldText(i18n.translate('DataUpload.IntermediateStep.Body'))}</Text>

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
