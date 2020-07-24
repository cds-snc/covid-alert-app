import React, {useCallback, useState, createContext, useContext, useMemo, forwardRef, MutableRefObject} from 'react';
import RNCarousel, {CarouselProperties, AdditionalParallaxProps, CarouselStatic} from 'react-native-snap-carousel';

const CurrentIndexContext = createContext(0);
const IsActiveContext = createContext(false);

interface ItemProps<T> {
  item: {item: T; index: number};
  parallaxProps?: AdditionalParallaxProps;
  renderItem(item: {item: T; index: number}, parallaxProps?: AdditionalParallaxProps): React.ReactNode;
}

function Item<T>({item, parallaxProps, renderItem}: ItemProps<T>) {
  const index = item.index;
  const currentIndex = useContext(CurrentIndexContext);
  const isActive = index === currentIndex;

  const children = useMemo(() => {
    return renderItem(item, parallaxProps);
  }, [item, parallaxProps, renderItem]);

  return <IsActiveContext.Provider value={isActive}>{children}</IsActiveContext.Provider>;
}

export type CarouselProps<T> = CarouselProperties<T>;

export type CarouselRef<T> = CarouselStatic<T>;

function CarouselInternal<T>(
  {renderItem, onSnapToItem, ...props}: CarouselProps<T>,
  ref: ((instance: T | null) => void) | MutableRefObject<T | null> | null,
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onSnapToItemWrapper = useCallback(
    (newIndex: number) => {
      setCurrentIndex(newIndex);
      onSnapToItem?.(newIndex);
    },
    [onSnapToItem],
  );

  const renderItemWrapper = useCallback<CarouselProps<T>['renderItem']>(
    (item, parallaxProps) => <Item item={item} parallaxProps={parallaxProps} renderItem={renderItem} />,
    [renderItem],
  );

  const children = useMemo(() => {
    return (
      <RNCarousel {...(props as any)} ref={ref} onSnapToItem={onSnapToItemWrapper} renderItem={renderItemWrapper} />
    );
  }, [onSnapToItemWrapper, props, ref, renderItemWrapper]);

  return <CurrentIndexContext.Provider value={currentIndex}>{children}</CurrentIndexContext.Provider>;
}

export const Carousel = forwardRef(CarouselInternal);

export const useCarouselActiveItem = () => {
  return useContext(IsActiveContext);
};
