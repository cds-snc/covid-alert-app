import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button, ButtonSingleLine} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';

interface Props {
  onSuccess: () => void;
}

export const Step1 = ({onSuccess}: Props) => {
  const [i18n] = useI18n();

  const navigation = useNavigation();
  const onNoCode = useCallback(() => navigation.navigate('NoCode'), [navigation]);

  const listStart = `${i18n.translate('DataUpload.Step1.Body1a')} \n ${i18n.translate(
    `A11yList.Start`,
  )} \n ${i18n.translate('DataUpload.Step1.Body1b')}`;
  const listEnd = `${i18n.translate('DataUpload.Step1.Body3a')} \n ${i18n.translate(
    'DataUpload.Step1.Body3b',
  )} \n ${i18n.translate(`A11yList.End`)}`;

  return (
    <>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.Step1.Title')}
          </Text>

          <Text marginBottom="l" accessible accessibilityLabel={listStart}>
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step1.Body1a')}</Text>
            <Text>{i18n.translate('DataUpload.Step1.Body1b')}</Text>
          </Text>
          <Text marginBottom="l">
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step1.Body2a')}</Text>
            <Text>{i18n.translate('DataUpload.Step1.Body2b')}</Text>
          </Text>
          <Text marginBottom="l" accessible accessibilityLabel={listEnd}>
            <Text fontWeight="bold">{i18n.translate('DataUpload.Step1.Body3a')}</Text>
            <Text>{i18n.translate('DataUpload.Step1.Body3b')}</Text>
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
