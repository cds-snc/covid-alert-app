import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  GestureResponderEvent,
  I18nManager,
  LayoutChangeEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native';

interface Props {
  rippleColor?: string;
  rippleCentered?: boolean;
  rippleOpacity?: number;
  rippleFades?: boolean;
  rippleExpandDuration?: number;
  rippleFadeDuration?: number;
  rippleSize?: number;
  rippleContainerBorderRadius?: number;
  children?: React.ReactNode;
}

interface AnimatedRipple {
  id: number;
  locationX: number;
  locationY: number;
  radius: number;
  expandAnimatedValue: Animated.Value;
  fadeAnimatedValue: Animated.Value;
  timestamp: number;
}

export type RippleProps = Props & TouchableWithoutFeedbackProps;

export const Ripple = ({
  children,
  disabled,
  rippleColor = 'rgb(0, 0, 0)',
  rippleCentered = false,
  rippleOpacity = 0.3,
  rippleExpandDuration = 500,
  rippleFadeDuration = 200,
  rippleContainerBorderRadius = 0,
  rippleSize = 0,
  ...touchableWithoutFeedbackProps
}: RippleProps) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const uuid = useRef(0);
  const [ripples, setRipples] = useState<AnimatedRipple[]>([]);
  const [fadings, setFadings] = useState<number[]>([]);

  const startFade = useCallback(
    (ripple: AnimatedRipple, duration: number) => {
      if (fadings.indexOf(ripple.id) >= 0) {
        return;
      }
      setFadings([...fadings, ripple.id]);
      Animated.timing(ripple.fadeAnimatedValue, {
        toValue: 1,
        easing: Easing.out(Easing.ease),
        duration,
        useNativeDriver: true,
      }).start(() => {
        setRipples(ripples.filter(item => item !== ripple));
      });
    },
    [fadings, ripples],
  );

  const startExpand = useCallback(
    (event: GestureResponderEvent) => {
      if (!width || !height) {
        return;
      }

      const timestamp = Date.now();
      if (ripples.length > 0 && timestamp < ripples[ripples.length - 1].timestamp + DEBOUNCE) {
        return;
      }

      const w2 = 0.5 * width;
      const h2 = 0.5 * height;

      const {locationX, locationY} = rippleCentered ? {locationX: w2, locationY: h2} : event.nativeEvent;

      const offsetX = Math.abs(w2 - locationX);
      const offsetY = Math.abs(h2 - locationY);

      const radius = rippleSize > 0 ? 0.5 * rippleSize : Math.sqrt((w2 + offsetX) ** 2 + (h2 + offsetY) ** 2);

      const id = uuid.current;
      uuid.current += 1;

      const ripple: AnimatedRipple = {
        id,
        locationX,
        locationY,
        radius,
        timestamp,
        expandAnimatedValue: new Animated.Value(0),
        fadeAnimatedValue: new Animated.Value(0),
      };

      Animated.timing(ripple.expandAnimatedValue, {
        toValue: 1,
        easing: Easing.out(Easing.ease),
        duration: rippleExpandDuration,
        useNativeDriver: true,
      }).start();

      setRipples(ripples.concat(ripple));
    },
    [height, rippleCentered, rippleExpandDuration, rippleSize, ripples, width],
  );

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const {
        nativeEvent: {
          layout: {height, width},
        },
      } = event;
      setWidth(width);
      setHeight(height);
      touchableWithoutFeedbackProps.onLayout?.(event);
    },
    [touchableWithoutFeedbackProps.onLayout],
  );

  const onPressIn = useCallback(
    (event: GestureResponderEvent) => {
      startExpand(event);
      touchableWithoutFeedbackProps.onPressIn?.(event);
    },
    [startExpand, touchableWithoutFeedbackProps.onPressIn],
  );

  const onPressOut = useCallback(
    (event: GestureResponderEvent) => {
      ripples.forEach(ripple => startFade(ripple, rippleFadeDuration + rippleExpandDuration / 2));
      touchableWithoutFeedbackProps.onPressOut?.(event);
    },
    [rippleExpandDuration, rippleFadeDuration, ripples, startFade, touchableWithoutFeedbackProps.onPressOut],
  );

  const onPress = useCallback(
    (event: GestureResponderEvent) => {
      requestAnimationFrame(() => {
        touchableWithoutFeedbackProps.onPress?.(event);
      });
    },
    [touchableWithoutFeedbackProps.onPress],
  );

  const renderRipple = useCallback(
    ({locationX, locationY, radius, id, expandAnimatedValue, fadeAnimatedValue}: AnimatedRipple) => {
      const rippleStyle = {
        top: locationY - RADIUS,
        [I18nManager.isRTL ? 'right' : 'left']: locationX - RADIUS,
        backgroundColor: rippleColor,
        transform: [
          {
            scale: expandAnimatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5 / RADIUS, radius / RADIUS],
            }),
          },
        ],
        opacity: fadeAnimatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [rippleOpacity, 0],
        }),
      };
      return <Animated.View style={[styles.ripple, rippleStyle]} key={id} />;
    },
    [rippleColor, rippleOpacity],
  );

  const style = useMemo(
    () => [
      styles.container,
      {
        borderRadius: rippleContainerBorderRadius,
      },
    ],
    [rippleContainerBorderRadius],
  );

  return (
    <TouchableWithoutFeedback
      {...touchableWithoutFeedbackProps}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      onLayout={onLayout}
    >
      <Animated.View pointerEvents="box-only">
        <View style={style}>{ripples.map(renderRipple)}</View>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const RADIUS = 8;
const DEBOUNCE = 200;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },

  ripple: {
    width: RADIUS * 2,
    height: RADIUS * 2,
    borderRadius: RADIUS,
    overflow: 'hidden',
    position: 'absolute',
  },
});
