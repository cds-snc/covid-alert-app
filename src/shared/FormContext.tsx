import React from 'react';

export const FormContextDefaults = {modalVisible: false};

export const FormContext = React.createContext({
  data: FormContextDefaults,
  toggleModal: (val: boolean) => {
    console.log('default toggleModal', val);
  },
});
