import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button, ButtonSingleLine} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {BoldText} from 'shared/BoldText';
import styles from 'shared/Styles';

import {BaseDataSharingView} from './components/BaseDataSharingView';

export const Step0Screen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const onNext = useCallback(() => navigation.navigate('FormView'), [navigation]);

  const onNoCode = useCallback(() => navigation.navigate('NoCode'), [navigation]);

  return (
    <BaseDataSharingView showBackButton={false}>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.Step0.Title')}
          </Text>

          <Text marginBottom="l">
            <Text>{BoldText(i18n.translate('DataUpload.Step0.List.1'))}</Text>
          </Text>
          <Text marginBottom="l">
            <Text>{BoldText(i18n.translate('DataUpload.Step0.List.2'))}</Text>
          </Text>
          <Text marginBottom="l">
            <Text>{BoldText(i18n.translate('DataUpload.Step0.List.3'))}</Text>
          </Text>
          <Text marginBottom="l" testID="Step0Body">
            <Text>{BoldText(i18n.translate('DataUpload.Step0.Body1'))}</Text>
          </Text>

          <Box marginTop="m">
            <Button variant="thinFlat" text={i18n.translate('DataUpload.Step0.CTA')} onPress={onNext} />
          </Box>
          <Box alignSelf="stretch" marginTop="xl" marginBottom="l">
            <ButtonSingleLine
              text={i18n.translate('DataUpload.Step0.NoCode')}
              variant="bigFlatNeutralGrey"
              internalLink
              onPress={onNoCode}
            />
          </Box>
        </Box>
      </ScrollView>
    </BaseDataSharingView>
  );
};
