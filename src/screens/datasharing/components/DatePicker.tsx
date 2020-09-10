import React, {useContext} from 'react';
import {Picker} from '@react-native-community/picker';
import {Platform, Modal, StyleSheet} from 'react-native';
import {Box, Button, ButtonSelect} from 'components';
import {addDays, getCurrentDate} from 'shared/date-fns';
import {useI18n} from 'locale';

import {FormContext} from '../../../shared/FormContext';

interface ModalWrapperProps {
  labelDict: any;
  children: React.ReactNode;
}

const ModalWrapper = ({labelDict, children}: ModalWrapperProps) => {
  const {data, toggleModal} = useContext(FormContext);
  return (
    <>
      <Modal animationType="slide" transparent visible={data.modalVisible}>
        <Box style={styles.centeredView}>
          <Box style={styles.iosPicker}>
            {children}
            <Button
              variant="text"
              onPress={() => {
                toggleModal(false);
              }}
              text="Close"
            />
          </Box>
        </Box>
      </Modal>
      <ButtonSelect
        disabled={data.modalVisible}
        variant="buttonSelect"
        iconName={data.modalVisible ? 'icon-down-arrow-disabled' : 'icon-down-arrow'}
        onPress={() => {
          toggleModal(true);
        }}
        text={`Date: ${labelDict[data.selectedDate]}`}
      />
    </>
  );
};

interface DatePickerInternalProps {
  dateOptions: any[];
  pickerStyles?: {};
}

const DatePickerInternal = ({dateOptions, pickerStyles}: DatePickerInternalProps) => {
  const {data, setDate} = useContext(FormContext);

  return (
    <Picker
      style={{...pickerStyles}}
      selectedValue={data.selectedDate}
      onValueChange={value => setDate(value.toString())}
      mode="dialog"
    >
      {dateOptions.map(x => (
        <Picker.Item key={x.value} label={x.label} value={x.value} />
      ))}
    </Picker>
  );
};

interface DatePickerProps {
  daysBack: number;
}

export const DatePicker = ({daysBack}: DatePickerProps) => {
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
      <ModalWrapper labelDict={labelDict}>
        <DatePickerInternal pickerStyles={{height: 200}} dateOptions={dateOptions} />
      </ModalWrapper>
    );
  }
  return (
    <Box style={{...styles.outline}} marginBottom="m">
      <DatePickerInternal dateOptions={dateOptions} />
    </Box>
  );
};

const styles = StyleSheet.create({
  outline: {
    borderWidth: 1,
    borderColor: '#000',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  iosPicker: {
    borderTopColor: 'white',
    backgroundColor: '#fff',
    borderTopWidth: 2,
    marginBottom: 0,
  },
});
