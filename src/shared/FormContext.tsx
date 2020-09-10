import React from 'react';

export const FormContextDefaults = {modalVisible: false, selectedDate: ''};

export const FormContext = React.createContext({
  data: FormContextDefaults,
  toggleModal: (val: boolean) => {
    return val;
  },
  setDate: (val: string) => {
    return val;
  },
});
