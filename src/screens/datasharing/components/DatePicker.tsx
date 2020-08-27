import React, {useState} from 'react';
import {Picker} from '@react-native-community/picker';
import {Platform, Modal, StyleSheet} from 'react-native';
import {Box, Button} from 'components';
import {addDays, getCurrentDate} from 'shared/date-fns';
import {useI18n} from 'locale';

interface ModalWrapperProps {
  labelDict: any;
  selectedDate: string;
  children: React.ReactNode;
}

const ModalWrapper = ({labelDict, selectedDate, children}: ModalWrapperProps) => {
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
        text={`Date: ${labelDict[selectedDate]}`}
      />
    </>
  );
};

interface DatePickerInternalProps {
  selectedDate: string;
  setSelectedDate: any;
  dateOptions: any[];
}

const DatePickerInternal = ({selectedDate, setSelectedDate, dateOptions}: DatePickerInternalProps) => {
  return (
    <Picker selectedValue={selectedDate} onValueChange={value => setSelectedDate(value)} mode="dialog">
      {dateOptions.map(x => (
        <Picker.Item key={x.value} label={x.label} value={x.value} />
      ))}
    </Picker>
  );
};

interface DatePickerProps {
  selectedDate: string;
  setSelectedDate: any;
  daysBack: number;
}

export const DatePicker = ({daysBack, selectedDate, setSelectedDate}: DatePickerProps) => {
  const i18n = useI18n();
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
      case daysBack - 1:
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
  for (let step = 0; step < daysBack; step++) {
    const date = addDays(today, -1 * step);
    const dateAtMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const label = getLabel(step, dateAtMidnight);
    labelDict[dateString] = label;
    dateOptions.push({label, value: dateString});
  }

  if (Platform.OS === 'ios') {
    return (
      <ModalWrapper labelDict={labelDict} selectedDate={selectedDate}>
        <DatePickerInternal selectedDate={selectedDate} setSelectedDate={setSelectedDate} dateOptions={dateOptions} />
      </ModalWrapper>
    );
  }
  return <DatePickerInternal selectedDate={selectedDate} setSelectedDate={setSelectedDate} dateOptions={dateOptions} />;
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
