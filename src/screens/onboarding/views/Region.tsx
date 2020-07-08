import React from 'react';

import {ItemView, ItemViewProps} from './ItemView';

export const Region = (props: Pick<ItemViewProps, 'isActive'>) => {
  return <ItemView {...props} item="step-6" image={require('assets/how-it-works-looking.png')} />;
};
