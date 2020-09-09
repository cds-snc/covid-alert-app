import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button, ButtonSingleLine} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

import {BaseDataSharingView} from './components/BaseDataSharingView';

export const Step1Screen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const onNext = useCallback(() => navigation.navigate('FormView'), [navigation]);

  const onNoCode = useCallback(() => navigation.navigate('NoCode'), [navigation]);

  return (
    <BaseDataSharingView>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.Step1.Title')}
          </Text>

          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step1.Body1a')}</Text>
            <Text>{i18n.translate('DataUpload.Step1.Body1b')}</Text>
          </Text>
          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step1.Body2a')}</Text>
            <Text>{i18n.translate('DataUpload.Step1.Body2b')}</Text>
          </Text>
          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step1.Body3a')}</Text>
            <Text>{i18n.translate('DataUpload.Step1.Body3b')}</Text>
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step1.Body3c')}</Text>
            <Text>{i18n.translate('DataUpload.Step1.Body3d')}</Text>
          </Text>
          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step1.Body4a')}</Text>
            <Text>{i18n.translate('DataUpload.Step1.Body4b')}</Text>
          </Text>
          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step1.Body5a')}</Text>
            <Text>{i18n.translate('DataUpload.Step1.Body5b')}</Text>
          </Text>

          <Box marginTop="m">
            <Button variant="thinFlat" text={i18n.translate('DataUpload.Step1.CTA')} onPress={onNext} />
          </Box>
          <Box alignSelf="stretch" marginTop="xl" marginBottom="l">
            <ButtonSingleLine
              text={i18n.translate('DataUpload.Step1.NoCode')}
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

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
