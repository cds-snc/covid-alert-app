import React, {useCallback, useState} from 'react';
import {Modal, Platform, ScrollView, StyleSheet} from 'react-native';
import {Box, Text, Button} from 'components';
import {useI18n} from 'locale';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-community/picker';
import {addDays, getCurrentDate} from 'shared/date-fns';
import {BaseDataSharingView} from './components/BaseDataSharingView';

const DatePicker = (symptomOnsetDate, setSymptomOnsetDate, dateOptions) => {
  return (
    <Picker selectedValue={symptomOnsetDate} onValueChange={value => setSymptomOnsetDate(value)} mode="dialog">
      {dateOptions.map(x => (
        <Picker.Item key={x.value} label={x.label} value={x.value} />
      ))}
    </Picker>
  );
};

const ModalWrapper = (labelDict, symptomOnsetDate) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <Box style={styles.centeredView}>
          <Button
            variant="text"
            onPress={() => {
              setModalVisible(false);
            }}
            text="Close"
          />
        </Box>
      </Modal>
      <Button
        variant="text"
        onPress={() => {
          setModalVisible(true);
        }}
        text={`Date: ${labelDict[symptomOnsetDate]}`}
      />
    </>
  );
};

export const SymptomOnsetDateScreen = () => {
  const i18n = useI18n();
  const navigation = useNavigation();
  const onNext = useCallback(() => navigation.navigate('Home'), [navigation]);
  const [symptomOnsetDate, setSymptomOnsetDate] = useState('');
  const today = getCurrentDate();
  const dateOptions = [];

  const getLabel = (step: number, date: Date) => {
    const dateLocale = i18n.locale === 'fr' ? 'fr-CA' : 'en-CA';
    switch (step) {
      case 0:
        // todo: these strings should come from i18n
        return 'Today';
      case 1:
        return 'Yesterday';
      case 13:
        return 'Even earlier';
      default:
        return date.toLocaleString(dateLocale, {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
    }
  };
  const labelDict = {'': 'None selected'};
  for (let step = 0; step < 14; step++) {
    const date = addDays(today, -1 * step);
    const dateAtMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const label = getLabel(step, dateAtMidnight);
    labelDict[dateString] = label;
    dateOptions.push({label, value: dateString});
  }
  return (
    <BaseDataSharingView>
      <ScrollView style={styles.flex}>
        <Box paddingHorizontal="m">
          <Text variant="bodyTitle" marginBottom="l" accessibilityRole="header" accessibilityAutoFocus>
            {i18n.translate('DataUpload.SymptomOnsetDate.Title')}
          </Text>
          <Text marginBottom="s">{i18n.translate('DataUpload.SymptomOnsetDate.Body1')}</Text>
          {Platform.OS === 'ios' ? (
            <ModalWrapper labelDict={labelDict} symptomOnsetDate={symptomOnsetDate}>
              <DatePicker
                symptomOnsetDate={symptomOnsetDate}
                setSymptomOnsetDate={setSymptomOnsetDate}
                dateOptions={dateOptions}
              />
            </ModalWrapper>
          ) : (
            <DatePicker
              symptomOnsetDate={symptomOnsetDate}
              setSymptomOnsetDate={setSymptomOnsetDate}
              dateOptions={dateOptions}
            />
          )}
          <Text marginBottom="l">{i18n.translate('DataUpload.SymptomOnsetDate.Body2')}</Text>
          <Text marginBottom="l">{i18n.translate('DataUpload.SymptomOnsetDate.Body3')}</Text>
          <Box marginTop="m">
            <Button variant="thinFlat" text={i18n.translate('DataUpload.SymptomOnsetDate.CTA')} onPress={onNext} />
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
});
