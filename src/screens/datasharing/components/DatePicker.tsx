import React, {useState} from 'react';
import {Picker} from '@react-native-community/picker';
import {Platform, Modal, StyleSheet} from 'react-native';
import {Box, Button} from 'components';
import {addDays, getCurrentDate} from 'shared/date-fns';
import {useI18n} from 'locale';

interface ModalWrapperProps {
  labelDict: any;
  symptomOnsetDate: string;
  children: React.ReactNode;
}

const ModalWrapper = ({labelDict, symptomOnsetDate, children}: ModalWrapperProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Modal animationType="slide" transparent visible={modalVisible}>
        <Box style={styles.centeredView}>
          <Box style={styles.iosPicker}>
            {children}
            <Button
              variant="text"
              onPress={() => {
                setModalVisible(false);
              }}
              text="Close"
            />
          </Box>
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

interface DatePickerInternalProps {
  symptomOnsetDate: string;
  setSymptomOnsetDate: any;
  dateOptions: any[];
}

const DatePickerInternal = ({symptomOnsetDate, setSymptomOnsetDate, dateOptions}: DatePickerInternalProps) => {
  return (
    <Picker selectedValue={symptomOnsetDate} onValueChange={value => setSymptomOnsetDate(value)} mode="dialog">
      {dateOptions.map(x => (
        <Picker.Item key={x.value} label={x.label} value={x.value} />
      ))}
    </Picker>
  );
};

export const DatePicker = () => {
  const i18n = useI18n();
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
        return date.toLocaleString(dateLocale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
    }
  };
  const labelDict: {[key: string]: string} = {'': 'None selected'};
  for (let step = 0; step < 14; step++) {
    const date = addDays(today, -1 * step);
    const dateAtMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const label = getLabel(step, dateAtMidnight);
    labelDict[dateString] = label;
    dateOptions.push({label, value: dateString});
  }

  if (Platform.OS === 'ios') {
    return (
      <ModalWrapper labelDict={labelDict} symptomOnsetDate={symptomOnsetDate}>
        <DatePickerInternal
          symptomOnsetDate={symptomOnsetDate}
          setSymptomOnsetDate={setSymptomOnsetDate}
          dateOptions={dateOptions}
        />
      </ModalWrapper>
    );
  }
  return (
    <DatePickerInternal
      symptomOnsetDate={symptomOnsetDate}
      setSymptomOnsetDate={setSymptomOnsetDate}
      dateOptions={dateOptions}
    />
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  iosPicker: {
    borderTopColor: 'black',
    backgroundColor: '#ededed',
    borderTopWidth: 2,
    marginBottom: 0,
  },
});
