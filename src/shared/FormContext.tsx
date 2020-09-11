import React from 'react';

export const FormContextDefaults = {
  modalVisible: false,
  symptomOnsetDate: '',
  testDate: '',
};

export const FormContext = React.createContext({
  data: FormContextDefaults,
  toggleModal: (val: boolean): any => {
    return val;
  },
  setSymptomOnsetDate: (val: string): any => {
    return val;
  },
  setTestDate: (val: string): any => {
    return val;
  },
});
