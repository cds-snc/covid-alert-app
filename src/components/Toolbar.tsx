import React, {useEffect} from 'react';
import {BackHandler, Platform, StyleSheet} from 'react-native';

import {Box} from './Box';
import {Button} from './Button';
import {IconProps} from './Icon';
import {Text} from './Text';
import {TouchableIcon} from './TouchableIcon';

export interface ToolbarProps {
  title: string;
  onIconClicked(): void;
  navText?: string /* iOS only */;
  navIcon?: IconProps['name'] /* Android only */;
  navLabel?: string;
}

export const Toolbar = ({title, navText, navIcon, navLabel, onIconClicked}: ToolbarProps) => {
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onIconClicked();
      return true;
    });
    return () => subscription.remove();
  }, [onIconClicked]);

  if (Platform.OS === 'android') {
    return (
      <Box flex={1} flexDirection="row" alignItems="center" justifyContent="flex-start" padding="none" maxHeight={56}>
        {navIcon && <TouchableIcon iconName={navIcon} label={navLabel} onPress={onIconClicked} />}
        <Box padding="m">
          <Text variant="bodySubTitle" color="overlayBodyText" accessibilityRole="header">
            {title}
          </Text>
        </Box>
      </Box>
    );
  }
  return (
    <Box flexDirection="row" alignItems="center" minHeight={56} paddingHorizontal="s">
      <Box paddingHorizontal="xs">
        <Button text={navText} variant="text" onPress={onIconClicked} />
      </Box>
      {title !== '' && (
        <Box flex={1} justifyContent="center" minWidth={100}>
          <Text variant="bodySubTitle" color="overlayBodyText" textAlign="center" accessibilityRole="header">
            {title}
          </Text>
        </Box>
      )}
      <Box style={styles.invisible}>
        <Button disabled text={navText} variant="text" onPress={() => {}} />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  invisible: {
    opacity: 0,
  },
});
