declare module 'react-native-material-ripple' {
  // / <reference types="react" />
  interface Props {
    rippleColor?: string;
    rippleOpacity?: number;
    rippleDuration?: number;
    rippleSize?: number;
    rippleContainerBorderRadius?: number;
    rippleCentered?: boolean;
    rippleSequential?: boolean;
    rippleFades?: boolean;
    disabled?: boolean;
    onPressIn?(): void;
    onPressOut?(): void;
    onPress?(): void;
    onLongPress?(): void;
    children?: JSX.Element;
  }

  export default function Ripple(props: Props): JSX.Element;
}
