import React, {forwardRef, useState, useCallback, useRef, useEffect, useMemo, useImperativeHandle} from 'react';
import {View, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import Animated from 'react-native-reanimated';
import {useSafeArea} from 'react-native-safe-area-context';
import BottomSheetRaw from 'reanimated-bottom-sheet';
import {useI18n} from '@shopify/react-i18n';

import {Box} from '../Box';
import {Icon} from '../Icon';

import {SheetContentsContainer} from './SheetContentsContainer';

const {abs, sub, pow} = Animated;

export interface BottomSheetProps {
  collapsed?: React.ComponentType;
  content: React.ComponentType;
  extraContent?: boolean;
}

export interface BottomSheetBahavior {
  expand(): void;
  collapse(): void;
}

const BottomSheetInternal = (
  {content: ContentComponent, collapsed: CollapsedComponent, extraContent}: BottomSheetProps,
  ref: React.Ref<BottomSheetBahavior>,
) => {
  const bottomSheetPosition = useRef(new Animated.Value(1));
  const bottomSheetRef: React.Ref<BottomSheetRaw> = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [i18n] = useI18n();
  const toggleExpanded = useCallback(() => {
    setIsExpanded(isExpanded => !isExpanded);
  }, []);

  useImperativeHandle(ref, () => ({
    expand: () => {
      setIsExpanded(true);
    },
    collapse: () => {
      setIsExpanded(false);
    },
  }));

  const insets = useSafeArea();
  const renderHeader = useCallback(() => <Box height={insets.top} />, [insets.top]);

  const onOpenEnd = useCallback(() => setIsExpanded(true), []);
  const onCloseEnd = useCallback(() => setIsExpanded(false), []);

  const {width, height} = useWindowDimensions();
  const snapPoints = [height, Math.max(width, height) * (extraContent ? 0.3 : 0.2)];

  // Need to add snapPoints to set enough height when BottomSheet is collapsed
  useEffect(() => {
    bottomSheetRef.current?.snapTo(isExpanded ? 0 : 1);
  }, [width, isExpanded, snapPoints]);

  const expandedContentWrapper = useMemo(
    () => (
      <Animated.View style={{opacity: abs(sub(bottomSheetPosition.current, 1))}}>
        <View style={styles.content}>
          <ContentComponent />
        </View>

        <View style={styles.collapseContentHandleBar}>
          <TouchableOpacity
            onPress={toggleExpanded}
            style={styles.collapseButton}
            accessibilityLabel={i18n.translate('BottomSheet.Collapse')}
            accessibilityRole="button"
          >
            <Icon name="sheet-handle-bar-close" size={44} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    ),
    [i18n, toggleExpanded],
  );
  const collapsedContentWrapper = useMemo(
    () => (
      <Animated.View style={{...styles.collapseContent, opacity: pow(bottomSheetPosition.current, 2)}}>
        <View style={styles.collapseContentHandleBar}>
          <Icon name="sheet-handle-bar" size={44} />
        </View>
        {CollapsedComponent ? (
          <View style={styles.content}>
            <CollapsedComponent />
          </View>
        ) : null}
      </Animated.View>
    ),
    [CollapsedComponent],
  );

  const renderContent = useCallback(() => {
    return (
      <SheetContentsContainer isExpanded={isExpanded} toggleExpanded={toggleExpanded}>
        <>
          {collapsedContentWrapper}
          {expandedContentWrapper}
        </>
      </SheetContentsContainer>
    );
  }, [collapsedContentWrapper, expandedContentWrapper, isExpanded, toggleExpanded]);

  return (
    <>
      <BottomSheetRaw
        ref={bottomSheetRef}
        borderRadius={32}
        enabledContentGestureInteraction
        renderContent={renderContent}
        onOpenEnd={onOpenEnd}
        onCloseEnd={onCloseEnd}
        renderHeader={renderHeader}
        snapPoints={snapPoints}
        initialSnap={1}
        callbackNode={bottomSheetPosition.current}
        enabledInnerScrolling
      />
      <Box height={snapPoints[1]} style={styles.spacer} />
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 10,
  },
  collapseContent: {
    position: 'absolute',
    width: '100%',
  },
  collapseContentHandleBar: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    top: -24,
  },
  collapseButton: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  spacer: {
    marginBottom: -18,
  },
});

export const BottomSheet = forwardRef(BottomSheetInternal);
