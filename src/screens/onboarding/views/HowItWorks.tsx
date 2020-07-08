import React from 'react';

import {ItemView, ItemViewProps} from './ItemView';

export const HowItWorks = (props: Pick<ItemViewProps, 'isActive'>) => {
  return <ItemView {...props} item="step-4" image={require('assets/how-it-works-positive.png')} />;
};
