import React from 'react';

import {ItemView, ItemViewProps} from './ItemView';

export const Permissions = (props: Pick<ItemViewProps, 'isActive'>) => {
  return <ItemView {...props} item="step-5" image={require('assets/how-it-works-looking.png')} />;
};
