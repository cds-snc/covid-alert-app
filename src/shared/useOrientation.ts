import {useWindowDimensions, ScaledSize} from 'react-native';

type Orientation = 'portrait' | 'landscape';

interface OrientationReturnValue {
  orientation: Orientation;
  scaledSize: ScaledSize;
}

export const useOrientation = (): OrientationReturnValue => {
  const scaledSize = useWindowDimensions();
  return {orientation: scaledSize.width > scaledSize.height ? 'landscape' : 'portrait', scaledSize};
};
