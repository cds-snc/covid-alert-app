import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button, ButtonSingleLine} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {useAccessibilityNavigationFocus} from 'shared/useAccessibilityNavigationFocus';
import {useAccessibilityAutoFocus} from 'shared/useAccessibilityAutoFocus';

interface Props {
  onSuccess: () => void;
}

export const Step1 = ({onSuccess}: Props) => {
  const i18n = useI18n();
  const [focusRef, autoFocusRef] = useAccessibilityAutoFocus();
  const navigation = useNavigation();
  const onNoCode = useCallback(() => navigation.navigate('NoCode'), [navigation]);
  useAccessibilityNavigationFocus(focusRef, null, true);

  return (
    <>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text focusRef={autoFocusRef} variant="bodyTitle" marginBottom="l" accessibilityRole="header">
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
          </Text>
          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step1.Body4a')}</Text>
            <Text>{i18n.translate('DataUpload.Step1.Body4b')}</Text>
          </Text>

          <Box marginTop="m">
            <Button variant="thinFlat" text={i18n.translate('DataUpload.Step1.CTA')} onPress={onSuccess} />
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
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
