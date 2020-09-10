import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

import {RadioButton} from './components/Radio';
import {BaseDataSharingView} from './components/BaseDataSharingView';
import {StepXofY} from './components';

export const Step2Screen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const [radio, setRadio] = useState('');

  const radioHandler = (val: string) => {
    setRadio(val);
  };

  return (
    <BaseDataSharingView>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <StepXofY currentStep={2} />
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.Step2.Title')}
          </Text>
          <Box marginTop="m">
            <RadioButton
              active={radio}
              value="0"
              text={i18n.translate('DataUpload.Step2.Option1')}
              onPress={radioHandler}
            />
            <RadioButton
              active={radio}
              value="1"
              text={i18n.translate('DataUpload.Step2.Option2')}
              onPress={radioHandler}
            />
            <RadioButton
              active={radio}
              value="2"
              text={i18n.translate('DataUpload.Step2.Option3')}
              onPress={radioHandler}
            />
            <RadioButton
              active={radio}
              value="3"
              text={i18n.translate('DataUpload.Step2.Option4')}
              onPress={radioHandler}
            />
          </Box>

          <Box marginTop="m">
            <Button
              variant="thinFlat"
              text={i18n.translate('DataUpload.Step2.Option4')}
              onPress={() => {
                const routes = ['SymptomOnsetDate', 'TestDate', 'TestDate', 'TekUploadNoDate'];
                const selected = Number(radio);
                navigation.navigate(routes[selected]);
              }}
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
