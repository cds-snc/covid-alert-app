import React from 'react';

export const FormContextDefaults = {modalVisible: false, selectedDate: ''};

export const FormContext = React.createContext({
  data: FormContextDefaults,
  toggleModal: (val: boolean): any => {
    return val;
  },
  setDate: (val: string): any => {
    return val;
  },
});
