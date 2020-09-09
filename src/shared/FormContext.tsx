import React from 'react';

export const FormContext = React.createContext({
  data: {modalVisible: false},
  toggleModal: (val: boolean) => {
    console.log('default toggleModal', val);
  },
});
