import React, {useCallback} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useNavigation} from '@react-navigation/native';

interface Props {
  onSuccess: () => void;
}

export const Step1 = ({onSuccess}: Props) => {
  const [i18n] = useI18n();

  const navigation = useNavigation();
  const onNoCode = useCallback(() => navigation.navigate('NoCode'), [navigation]);

  return (
    <>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" color="bodyText" marginBottom="l" accessibilityRole="header">
            {i18n.translate('DataUpload.Step1.Title')}
          </Text>

          <Text variant="bodyText" color="bodyText" marginBottom="l">
            {i18n.translate('DataUpload.Step1.Body')}
          </Text>
          <Box>
            <Button variant="bigFlat" text={i18n.translate('DataUpload.Step1.CTA')} onPress={onSuccess} />
          </Box>
          <Box marginBottom="m">
            <Button variant="text" text={i18n.translate('DataUpload.Step1.NoCode')} onPress={onNoCode} />
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
