import {useTheme} from '@shopify/restyle';

import {useOrientation} from './useOrientation';
import {Theme} from './theme';

export const useMaxContentWidth = (): number | undefined => {
  const {maxContentWidth} = useTheme<Theme>();
  const {orientation} = useOrientation();
  return orientation === 'landscape' ? maxContentWidth : undefined;
};
