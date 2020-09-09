import React from 'react';

export const FormContextDefaults = {modalVisible: false, selectedDate: ''};

export const FormContext = React.createContext({
  data: FormContextDefaults,
  toggleModal: (val: boolean) => {
    console.log('default toggleModal', val);
  },
  setDate: (val: string) => {
    console.log('default setDate', val);
  },
});
