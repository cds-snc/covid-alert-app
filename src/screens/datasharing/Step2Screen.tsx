import React, {useState, useCallback} from 'react';
import {ScrollView, StyleSheet, Alert} from 'react-native';
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
  const onError = useCallback(() => {
    Alert.alert('', i18n.translate(`Errors.DataSharingStep2.Body`), [{text: ''}]);
  }, [i18n]);
  return (
    <BaseDataSharingView closeRoute="Home">
      <ScrollView style={styles.flex}>
        <Box marginHorizontal="m">
          <StepXofY currentStep={2} />
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.Step2.Title1')}
          </Text>
          <Text marginBottom="s">{i18n.translate('DataUpload.Step2.Body1')}</Text>
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.1')}
            listAccessibile="listStart"
            text={i18n.translate('DataUpload.Step2.Symptoms.1')}
          />
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.2')}
            listAccessibile="listItem"
            text={i18n.translate('DataUpload.Step2.Symptoms.2')}
          />
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.3')}
            listAccessibile="listItem"
            text={i18n.translate('DataUpload.Step2.Symptoms.3')}
          />
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.4')}
            listAccessibile="listItem"
            text={i18n.translate('DataUpload.Step2.Symptoms.4')}
          />
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.5')}
            listAccessibile="listItem"
            text={i18n.translate('DataUpload.Step2.Symptoms.5')}
          />
          <BulletPoint
            key={i18n.translate('DataUpload.Step2.Symptoms.6')}
            listAccessibile="listItem"
            text={i18n.translate('DataUpload.Step2.Symptoms.6')}
          />
          <Box marginTop="xl" accessibilityRole="radiogroup">
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
          <Text marginTop="l" marginBottom="s" variant="bodyTitle2">
            {i18n.translate('DataUpload.Step2.Title2')}
          </Text>
          <Text marginBottom="l">{i18n.translate('DataUpload.Step2.Body2')}</Text>

          <Box marginTop="m" marginBottom="m">
            <Button
              variant="thinFlat"
              text={i18n.translate('DataUpload.Step2.CTA')}
              onPress={() => {
                if (radio === '') {
                  onError();
                  return;
                }
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
