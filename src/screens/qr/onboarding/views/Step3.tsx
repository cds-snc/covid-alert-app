import React from 'react';

import {ItemView, ItemViewProps} from './ItemView';

export const Step3 = (props: Pick<ItemViewProps, 'isActive'>) => {
  return <ItemView {...props} item="step-3" image={require('assets/qr-code-onboard-3.png')} />;
};
