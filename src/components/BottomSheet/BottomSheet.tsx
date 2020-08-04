import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheetRaw from 'reanimated-bottom-sheet';
import {useOrientation} from 'shared/useOrientation';
import {useSafeArea} from 'components';

import {Box} from '../Box';

import {SheetContentsContainer} from './SheetContentsContainer';

export interface BottomSheetBehavior {
  expand(): void;
  collapse(): void;
  refreshSnapPoints(extraContent: boolean): void;
  callbackNode: Animated.Value<number>;
  setOnStateChange(onStateChange: (isExpanded: boolean) => void): void;
  isExpanded: boolean;
}

export interface BottomSheetProps {
  collapsedComponent: React.ComponentType<BottomSheetBehavior>;
  expandedComponent: React.ComponentType<BottomSheetBehavior>;
}

const BottomSheetInternal = (
  {expandedComponent: ExpandedComponent, collapsedComponent: CollapsedComponent}: BottomSheetProps,
  ref: React.Ref<BottomSheetBehavior>,
) => {
  const bottomSheetPosition = useRef(new Animated.Value(1));
  const bottomSheetRef: React.Ref<BottomSheetRaw> = useRef(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [extraContent, setExtraContent] = useState(false);
  const [onStateChange, setOnStateChange] = useState<(isExpanded: boolean) => void>();

  const behavior = useMemo<BottomSheetBehavior>(
    () => ({
      expand: () => {
        setIsExpanded(true);
      },
      collapse: () => {
        setIsExpanded(false);
      },
      refreshSnapPoints: setExtraContent,
      callbackNode: bottomSheetPosition.current,
      setOnStateChange: callback => setOnStateChange(() => callback),
      isExpanded,
    }),
    [isExpanded],
  );
  useImperativeHandle(ref, () => behavior, [behavior]);
  useEffect(() => onStateChange?.(isExpanded), [isExpanded, onStateChange]);
  const {orientation} = useOrientation();
  const bottomPadding = orientation === 'landscape' ? 120 : 140;

  const onOpenEnd = useCallback(() => setIsExpanded(true), []);
  const onCloseEnd = useCallback(() => setIsExpanded(false), []);

  const {contentWidth: width, contentHeight: height} = useSafeArea();
  const snapPoints = [height, extraContent ? 200 : bottomPadding];

  // Need to add snapPoints to set enough height when BottomSheet is collapsed
  useEffect(() => {
    bottomSheetRef.current?.snapTo(isExpanded ? 0 : 1);
  }, [width, isExpanded, snapPoints]);

  const expandedComponentWrapper = useMemo(() => <ExpandedComponent {...behavior} />, [behavior]);
  const collapsedComponentWrapper = useMemo(() => <CollapsedComponent {...behavior} />, [behavior]);

  const renderContent = useCallback(() => {
    return (
      <SheetContentsContainer>
        <>
          <View
            style={styles.collapseContent}
            accessibilityElementsHidden={isExpanded}
            importantForAccessibility={isExpanded ? 'no-hide-descendants' : undefined}
            pointerEvents={isExpanded ? 'none' : undefined}
          >
            {collapsedComponentWrapper}
          </View>
          <View
            pointerEvents={isExpanded ? undefined : 'none'}
            accessibilityElementsHidden={!isExpanded}
            importantForAccessibility={isExpanded ? undefined : 'no-hide-descendants'}
          >
            {expandedComponentWrapper}
          </View>
        </>
      </SheetContentsContainer>
    );
  }, [collapsedComponentWrapper, expandedComponentWrapper, isExpanded]);

  return (
    <>
      <BottomSheetRaw
        ref={bottomSheetRef}
        borderRadius={32}
        enabledContentGestureInteraction
        renderContent={renderContent}
        onOpenEnd={onOpenEnd}
        onCloseEnd={onCloseEnd}
        snapPoints={snapPoints}
        initialSnap={1}
        callbackNode={bottomSheetPosition.current}
        enabledInnerScrolling
      />
      <Box height={snapPoints[1]} />
    </>
  );
};

const styles = StyleSheet.create({
  collapseContent: {
    position: 'absolute',
    width: '100%',
  },
});

export const BottomSheet = forwardRef(BottomSheetInternal);
