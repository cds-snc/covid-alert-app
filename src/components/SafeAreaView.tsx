import React, {useMemo, createContext, useState, useCallback, useContext} from 'react';
import {
  SafeAreaView as RNSafeAreaView,
  Platform,
  ViewProps,
  StatusBar,
  LayoutChangeEvent,
  View,
  StyleSheet,
} from 'react-native';

interface SafeArea {
  contentWidth: number;
  contentHeight: number;
}

const SafeAreaContext = createContext<SafeArea | undefined>(undefined);

export type SafeAreaViewProps = ViewProps & {
  children?: React.ReactNode;
};

/**
 * This SafeAreaView should not be nested
 */
export const SafeAreaView = ({children, style, ...props}: SafeAreaViewProps) => {
  const androidStyle = useMemo(
    () => [
      styles.flex,
      {
        paddingTop: StatusBar.currentHeight,
      },
    ],
    [],
  );

  const combinedStyles = useMemo(() => [styles.flex, style], [style]);

  const [safeArea, setSafeArea] = useState<SafeArea | undefined>(undefined);
  const onLayout = useCallback(({nativeEvent: {layout: {width, height}}}: LayoutChangeEvent) => {
    setSafeArea({
      contentWidth: width,
      contentHeight: height,
    });
  }, []);

  const content = useMemo(() => {
    return (
      <View style={styles.flex} onLayout={onLayout}>
        {safeArea && <SafeAreaContext.Provider value={safeArea}>{children}</SafeAreaContext.Provider>}
      </View>
    );
  }, [children, onLayout, safeArea]);

  return (
    <View style={combinedStyles} {...props}>
      {Platform.OS === 'android' ? (
        <View style={androidStyle}>{content}</View>
      ) : (
        <RNSafeAreaView>{content}</RNSafeAreaView>
      )}
    </View>
  );
};

export const useSafeArea = () => {
  const safeArea = useContext(SafeAreaContext);
  if (!safeArea) {
    throw new Error('useSafeArea needs SafeAreaView');
  }
  return safeArea;
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
