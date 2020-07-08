import React from 'react';

import {ItemView, ItemViewProps} from './ItemView';

export const Step4 = (props: Pick<ItemViewProps, 'isActive'>) => {
  return <ItemView {...props} item="step-4" image={require('assets/how-it-works-looking.png')} />;
};
