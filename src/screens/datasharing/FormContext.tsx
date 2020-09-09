import React from 'react';

export const FormContext = React.createContext({
  modalVisible: true,
  toggleModal: (val: boolean) => {
    console.log(val);
  },
});
