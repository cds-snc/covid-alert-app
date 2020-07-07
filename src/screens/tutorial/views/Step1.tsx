import React from 'react';

import {ItemView, ItemViewProps} from './ItemView';

export const Step1 = (props: Pick<ItemViewProps, 'isActive'>) => {
  return <ItemView {...props} item="step-1" image={require('assets/how-it-works-intro.png')} />;
};
