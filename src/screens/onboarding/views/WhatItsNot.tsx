import React from 'react';

import {ItemView, ItemViewProps} from './ItemView';

export const WhatItsNot = (props: Pick<ItemViewProps, 'isActive'>) => {
  return <ItemView {...props} item="step-3" image={require('assets/how-it-works-looking.png')} />;
};
