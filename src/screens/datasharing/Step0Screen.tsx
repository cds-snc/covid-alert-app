import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button, ButtonSingleLine} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

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
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step0.List.1a')}</Text>
            <Text>{i18n.translate('DataUpload.Step0.List.1b')}</Text>
          </Text>
          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step0.List.2a')}</Text>
            <Text>{i18n.translate('DataUpload.Step0.List.2b')}</Text>
          </Text>
          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step0.List.3a')}</Text>
            <Text>{i18n.translate('DataUpload.Step0.List.3b')}</Text>
          </Text>
          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step0.Body1')}</Text>
            <Text>{i18n.translate('DataUpload.Step0.Body2')}</Text>
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

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
