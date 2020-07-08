import React from 'react';

import {ItemView, ItemViewProps} from './ItemView';

export const Anonymous = (props: Pick<ItemViewProps, 'isActive'>) => {
  return <ItemView {...props} item="step-2" image={require('assets/how-it-works-exposure.png')} />;
};
