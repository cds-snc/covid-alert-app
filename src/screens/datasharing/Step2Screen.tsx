import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';

import {BulletPoint} from '../../components/BulletPoint';

import {RadioButton} from './components/Radio';
import {BaseDataSharingView} from './components/BaseDataSharingView';
import {StepXofY} from './components';

export const Step2Screen = () => {
  const i18n = useI18n();
  const [radio, setRadio] = useState('');
  const navigation = useNavigation();
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
          <Text marginBottom="l">{i18n.translate('DataUpload.Step2.Body1')}</Text>
          <Text fontWeight="bold" marginBottom="l">
            {i18n.translate('DataUpload.Step2.Body2')}
          </Text>
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.symptom1')}
            listAccessibile="listStart"
            text={i18n.translate('DataUpload.Step2.Symptoms.symptom1')}
          />
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.symptom2')}
            listAccessibile="listItem"
            text={i18n.translate('DataUpload.Step2.Symptoms.symptom2')}
          />
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.symptom3')}
            listAccessibile="listItem"
            text={i18n.translate('DataUpload.Step2.Symptoms.symptom3')}
          />
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.symptom4')}
            listAccessibile="listItem"
            text={i18n.translate('DataUpload.Step2.Symptoms.symptom4')}
          />
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.symptom5')}
            listAccessibile="listItem"
            text={i18n.translate('DataUpload.Step2.Symptoms.symptom5')}
          />
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.symptom6')}
            listAccessibile="listItem"
            text={i18n.translate('DataUpload.Step2.Symptoms.symptom6')}
          />
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.symptom7')}
            listAccessibile="listItem"
            text={i18n.translate('DataUpload.Step2.Symptoms.symptom7')}
          />
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.symptom8')}
            listAccessibile="listItem"
            text={i18n.translate('DataUpload.Step2.Symptoms.symptom8')}
          />
          <Text fontWeight="bold" marginTop="l">
            {i18n.translate('DataUpload.Step2.Body3')}
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

          <Box marginTop="m" marginBottom="m">
            <Button
              variant="thinFlat"
              disabled={radio === ''}
              text={i18n.translate('DataUpload.Step2.CTA')}
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
