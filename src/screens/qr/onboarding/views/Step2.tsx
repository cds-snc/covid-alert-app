import React from 'react';

import {ItemView, ItemViewProps} from './ItemView';

export const Step2 = (props: Pick<ItemViewProps, 'isActive'>) => {
  return <ItemView {...props} item="step-2" image={require('assets/qr-code-onboard-2.png')} />;
};
