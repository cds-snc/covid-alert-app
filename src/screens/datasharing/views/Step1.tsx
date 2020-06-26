import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button, Toolbar} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';

interface Props {
  onSuccess: () => void;
}

export const Step1 = ({onSuccess}: Props) => {
  const [i18n] = useI18n();

  const navigation = useNavigation();
  const close = useCallback(() => navigation.goBack(), [navigation]);
  const onNoCode = useCallback(() => navigation.navigate('NoCode'), [navigation]);

  return (
    <>
      <Toolbar
        title=""
        navIcon="icon-back-arrow"
        navText={i18n.translate('DataUpload.Step1.Cancel')}
        navLabel={i18n.translate('DataUpload.Step1.Cancel')}
        onIconClicked={close}
      />
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" color="bodyText" marginBottom="xl" accessibilityRole="header">
            {i18n.translate('DataUpload.Step1.Title')}
          </Text>

          <Text variant="bodyText" color="bodyText" marginBottom="xl">
            <Text style={styles.step}>
              {i18n.translate('DataUpload.Step1.Step')}
              {' ' + 1 + ' '}
            </Text>
            {i18n.translate('DataUpload.Step1.Body1')}
          </Text>

          <Text variant="bodyText" color="bodyText" marginBottom="xl">
            <Text style={styles.step}>
              {i18n.translate('DataUpload.Step1.Step')}
              {' ' + 2 + ' '}
            </Text>
            {i18n.translate('DataUpload.Step1.Body2')}
          </Text>

          <Text variant="bodyText" color="bodyText" marginBottom="xl">
            <Text style={styles.step}>
              {i18n.translate('DataUpload.Step1.Step')}
              {' ' + 3 + ' '}
            </Text>
            {i18n.translate('DataUpload.Step1.Body3')}
          </Text>

          <Box marginBottom="xxl">
            <Button variant="thinFlat" text={i18n.translate('DataUpload.Step1.CTA')} onPress={onSuccess} />
          </Box>

          <Box marginBottom="m">
            <Button
              variant="bigFlatNeutralGrey"
              internalLink
              text={i18n.translate('DataUpload.Step1.NoCode')}
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
  step: {
    fontWeight: 'bold',
  },
});
