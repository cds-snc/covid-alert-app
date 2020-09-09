import React from 'react';

export const FormContext = React.createContext({
  data: {modalVisible: false, selectedDate: ''},
  toggleModal: (val: boolean) => {
    console.log('default toggleModal', val);
  },
  setDate: (val: string) => {
    console.log('default setDate', val);
  },
});
